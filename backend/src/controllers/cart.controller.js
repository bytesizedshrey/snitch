import mongoose from 'mongoose';
import cartDao from '../dao/cart.dao.js';
import productDao from '../dao/product.dao.js';

// Get user's cart
export async function getCart(req, res) {
    try {
        // Genz comment: vibe check the cart doc first. if it ghosted us, we manifest a new one fr fr
        let cartDoc = await cartDao.findCartByUser(req.user._id);
        if (!cartDoc) {
            cartDoc = await cartDao.createCart(req.user._id);
        }

        // Genz comment: we gotta populate to see if the prices are actin sus and changed behind our back
        await cartDoc.populate('items.product', 'title price variants');

        let isModified = false;
        let priceChanges = [];

        // Genz comment: looping through the bag to fact check the prices no cap
        for (let item of cartDoc.items) {
            if (item.product) {
                const product = item.product;
                const variant = product.variants?.id(item.variant);
                
                // Genz comment: default variants catching strays, we use top level product price for them
                const isDefaultVariant = variant && variant.size === "OS" && variant.color === "Default";
                const priceAmount = (variant && variant.price && variant.price.amount !== undefined && variant.price.amount !== null && !isDefaultVariant)
                    ? variant.price.amount
                    : (product.price?.amount || 0);

                const priceCurrency = (variant && variant.price && variant.price.currency && !isDefaultVariant)
                    ? variant.price.currency
                    : (product.price?.currency || 'INR');

                if (!item.price || item.price.amount !== priceAmount || item.price.currency !== priceCurrency) {
                    priceChanges.push({
                        title: product.title,
                        oldPrice: item.price ? { amount: item.price.amount, currency: item.price.currency } : { amount: 0, currency: priceCurrency },
                        newPrice: { amount: priceAmount, currency: priceCurrency }
                    });

                    item.price = {
                        amount: priceAmount,
                        currency: priceCurrency
                    };
                    isModified = true;
                }
            }
        }

        if (isModified) {
            // Genz comment: saving the receipts if the prices changed fr
            await cartDao.saveCart(cartDoc);
        }

        // Genz comment: let the aggregate pipeline cook to get the W totals and populated data
        const cartAgg = await cartDao.aggregate([
            {
                $match: { user: new mongoose.Types.ObjectId(req.user._id) }
            },
            { $unwind: { path: '$items', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'items.product'
                }
            },
            { $unwind: { path: '$items.product', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: '$_id',
                    user: { $first: '$user' },
                    totalPrice: {
                        $sum: {
                            $cond: {
                                if: { $gt: ['$items.product._id', null] },
                                then: { $multiply: ['$items.quantity', '$items.price.amount'] },
                                else: 0
                            }
                        }
                    },
                    currency: { $first: '$items.price.currency' },
                    items: {
                        $push: {
                            $cond: {
                                if: { $gt: ['$items.product._id', null] },
                                then: '$items',
                                else: '$$REMOVE'
                            }
                        }
                    }
                }
            }
        ]);

        // Genz comment: serving the final bussin cart response
        let cartResponse = cartAgg[0] || { items: [], totalPrice: 0, currency: 'INR' };
        cartResponse.priceChanges = priceChanges;

        res.status(200).json(cartResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch cart" });
    }
}

// Add item to cart
export async function addToCart(req, res) {
    try {
        const { productId, quantity = 1 } = req.body;
        let { variantId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "productId is required" });
        }

        // Check if product exists
        const product = await productDao.findProductById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // If no variantId provided, default to first variant
        if (!variantId) {
            if (product.variants && product.variants.length > 0) {
                variantId = product.variants[0]._id.toString();
            } else {
                // Dynamically create a default variant since none exist
                const defaultVariant = {
                    size: "OS",
                    color: "Default",
                    price: {
                        amount: product.price?.amount || 0,
                        currency: product.price?.currency || 'INR'
                    },
                    stock: 100
                };
                product.variants.push(defaultVariant);
                await product.save();
                variantId = product.variants[product.variants.length - 1]._id.toString();
            }
        }

        const variant = product.variants.id(variantId);
        if (!variant) {
            return res.status(404).json({ message: "Variant not found" });
        }

        // Validate stock
        if (variant.stock < quantity) {
            return res.status(400).json({ message: "Insufficient stock" });
        }

        // Find or create cart
        let cart = await cartDao.findCartByUser(req.user._id);
        if (!cart) {
            cart = await cartDao.createCart(req.user._id);
        }

        // Determine price from variant (or fallback to product price)
        const isDefaultVariant = variant && variant.size === "OS" && variant.color === "Default";
        const priceAmount = (variant.price && variant.price.amount !== undefined && variant.price.amount !== null && !isDefaultVariant)
            ? variant.price.amount
            : (product.price?.amount || 0);

        const priceCurrency = (variant.price && variant.price.currency && !isDefaultVariant)
            ? variant.price.currency
            : (product.price?.currency || 'INR');

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId && item.variant.toString() === variantId
        );

        if (existingItemIndex > -1) {
            // Update quantity and price
            cart.items[existingItemIndex].quantity += Number(quantity);
            cart.items[existingItemIndex].price = {
                amount: priceAmount,
                currency: priceCurrency
            };
            
            if (cart.items[existingItemIndex].quantity > variant.stock) {
                 return res.status(400).json({ message: "Cannot add more than available stock" });
            }
        } else {
            // Add new item
            cart.items.push({
                product: productId,
                variant: variantId,
                quantity: Number(quantity),
                price: {
                    amount: priceAmount,
                    currency: priceCurrency
                }
            });
        }

        await cartDao.saveCart(cart);
        
        // Return populated cart
        cart = await cart.populate('items.product', 'title price images seller variants');
        res.status(200).json(cart);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add item to cart" });
    }
}

// Update item quantity
export async function updateCartItemQuantity(req, res) {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;

        if (quantity === undefined || quantity < 1) {
            return res.status(400).json({ message: "Valid quantity (>= 1) is required" });
        }

        const cart = await cartDao.findCartByUser(req.user._id);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.id(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        // Check stock
        const product = await productDao.findProductById(item.product);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        const variant = product.variants.id(item.variant);
        if (!variant || variant.stock < quantity) {
             return res.status(400).json({ message: "Insufficient stock" });
        }

        const isDefaultVariant = variant && variant.size === "OS" && variant.color === "Default";
        const priceAmount = (variant.price && variant.price.amount !== undefined && variant.price.amount !== null && !isDefaultVariant)
            ? variant.price.amount
            : (product.price?.amount || 0);

        const priceCurrency = (variant.price && variant.price.currency && !isDefaultVariant)
            ? variant.price.currency
            : (product.price?.currency || 'INR');

        item.quantity = quantity;
        item.price = {
            amount: priceAmount,
            currency: priceCurrency
        };
        await cartDao.saveCart(cart);

        await cart.populate('items.product', 'title price images seller variants');
        res.status(200).json(cart);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update item quantity" });
    }
}

// Remove item from cart
export async function removeFromCart(req, res) {
    try {
        const { itemId } = req.params;

        const cart = await cartDao.findCartByUser(req.user._id);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items.pull(itemId);
        await cartDao.saveCart(cart);

        await cart.populate('items.product', 'title price images seller variants');
        res.status(200).json(cart);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to remove item from cart" });
    }
}

// Clear cart
export async function clearCart(req, res) {
    try {
        const cart = await cartDao.findCartByUser(req.user._id);
        if (cart) {
            cart.items = [];
            await cartDao.saveCart(cart);
        }
        res.status(200).json({ message: "Cart cleared successfully", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to clear cart" });
    }
}

import paymentService from '../service/payment.service.js';
import orderModel from '../models/order.model.js';
import paymentModel from '../models/payment.model.js';

export async function createOrder(req, res) {
    try {
        const cartAgg = await cartDao.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.user._id) } },
            { $unwind: { path: '$items', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'items.product'
                }
            },
            { $unwind: { path: '$items.product', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: '$_id',
                    user: { $first: '$user' },
                    totalPrice: {
                        $sum: {
                            $cond: {
                                if: { $gt: ['$items.product._id', null] },
                                then: { $multiply: ['$items.quantity', '$items.price.amount'] },
                                else: 0
                            }
                        }
                    },
                    currency: { $first: '$items.price.currency' },
                    items: {
                        $push: {
                            $cond: {
                                if: { $gt: ['$items.product._id', null] },
                                then: '$items',
                                else: '$$REMOVE'
                            }
                        }
                    }
                }
            }
        ]);

        const cartData = cartAgg[0];
        
        if (!cartData || !cartData.items || cartData.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        let multiplier = 100;
        if (['JPY'].includes(cartData.currency)) {
             multiplier = 1; 
        }
        const amountInSmallestUnit = Math.round(cartData.totalPrice * multiplier);

        // Razorpay receipt length must be <= 40 characters
        const receiptId = `rcpt_${Date.now().toString().slice(-8)}_${req.user._id.toString().slice(-6)}`;
        
        const razorpayOrder = await paymentService.createOrder(
            amountInSmallestUnit, 
            cartData.currency || 'INR', 
            receiptId
        );

        res.status(200).json({
            success: true,
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency
        });

    } catch (error) {
        console.error("Create order error:", error);
        res.status(500).json({ message: "Failed to create payment order" });
    }
}

export async function verifyOrderController(req, res) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
             return res.status(400).json({ message: "Missing payment verification parameters" });
        }

        const isValid = paymentService.verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

        if (!isValid) {
            return res.status(400).json({ message: "Invalid payment signature" });
        }

        const cart = await cartDao.findCartByUser(req.user._id);
        if (!cart || cart.items.length === 0) {
             return res.status(400).json({ message: "Cart is empty or already processed" });
        }

        let totalAmount = 0;
        let currency = 'INR';
        for (const item of cart.items) {
             if (item.price) {
                  totalAmount += (item.price.amount * item.quantity);
                  currency = item.price.currency;
             }
        }

        const newOrder = await orderModel.create({
            user: req.user._id,
            items: cart.items,
            totalAmount,
            currency,
            paymentStatus: 'completed',
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature
        });

        // Record the verified payment explicitly in the payment collection
        const newPayment = await paymentModel.create({
            user: req.user._id,
            order: newOrder._id,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            amount: totalAmount,
            currency: currency,
            status: 'success'
        });

        cart.items = [];
        await cartDao.saveCart(cart);

        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            order: newOrder
        });

    } catch (error) {
        console.error("Payment verification error:", error);
        res.status(500).json({ message: "Payment verification failed" });
    }
}

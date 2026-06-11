import cartDao from '../dao/cart.dao.js';
import productDao from '../dao/product.dao.js';

// Get user's cart
export async function getCart(req, res) {
    try {
        let cart = await cartDao.findPopulatedCartByUser(req.user._id);

        if (!cart) {
            cart = await cartDao.createCart(req.user._id);
        }

        let isModified = false;
        let priceChanges = [];

        for (let item of cart.items) {
            if (item.product) {
                const product = item.product;
                const variant = product.variants?.id(item.variant);
                
                // Determine latest price from variant (or fallback to product price)
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
            await cartDao.saveCart(cart);
        }

        const cartResponse = cart.toJSON ? cart.toJSON() : cart;
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

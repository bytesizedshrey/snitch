import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cartDao from './src/dao/cart.dao.js';
import paymentService from './src/service/payment.service.js';
import './src/models/cart.model.js';
import './src/models/product.model.js';
import './src/models/user.model.js';

dotenv.config();

async function test() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");
    
    // Get first cart
    const cartModel = mongoose.model('cart');
    const firstCart = await cartModel.findOne({ "items.0": { $exists: true } });
    if (!firstCart) {
        console.log("No cart with items found");
        process.exit(0);
    }
    
    console.log("Cart found for user:", firstCart.user);
    
    const cartAgg = await cartDao.aggregate([
        { $match: { user: firstCart.user } },
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

    console.log("Aggregated Cart:", JSON.stringify(cartAgg, null, 2));
    
    if (cartAgg.length === 0) return;
    const cartData = cartAgg[0];
    
    const amountInSmallestUnit = Math.round(cartData.totalPrice * 100);
    console.log("Amount in smallest unit:", amountInSmallestUnit);
    
    try {
        const receiptId = `receipt_${firstCart.user}_${Date.now()}`;
        const order = await paymentService.createOrder(amountInSmallestUnit, cartData.currency || 'INR', receiptId);
        console.log("Order created:", order);
    } catch (e) {
        console.error("Razorpay Error:", e.message || e);
    }
    
    process.exit(0);
}

test();

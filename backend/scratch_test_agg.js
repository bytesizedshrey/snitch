import mongoose from 'mongoose';
import cartDao from './src/dao/cart.dao.js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const cartAgg = await cartDao.aggregate([
        {
            $match: {} // match all just for test
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

    console.log("Aggregated cart:", JSON.stringify(cartAgg, null, 2));
    process.exit(0);
}

run().catch(console.error);

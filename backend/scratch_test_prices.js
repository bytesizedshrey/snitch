import mongoose from 'mongoose';
import productModel from './src/models/product.model.js';
import cartModel from './src/models/cart.model.js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const cart = await cartModel.findOne().populate('items.product', 'title price variants').lean();
    if (!cart) {
        console.log("No cart found");
        process.exit(0);
    }

    console.log("Cart User:", cart.user);
    for (let item of cart.items) {
        console.log(`\nItem: ${item.product.title}`);
        console.log(`Cart Item Price: ${item.price?.amount} ${item.price?.currency}`);
        console.log(`Product Top Level Price: ${item.product.price?.amount} ${item.product.price?.currency}`);
        const variant = item.product.variants.find(v => v._id.toString() === item.variant.toString());
        if (variant) {
            console.log(`Variant Price: ${variant.price?.amount} ${variant.price?.currency}`);
        } else {
            console.log("Variant not found in product");
        }
    }
    
    process.exit(0);
}

run().catch(console.error);

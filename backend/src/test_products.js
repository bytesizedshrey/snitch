import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import app from './app.js';
import { config } from './config/config.js';
import userModel from './models/user.model.js';
import productModel from './models/product.model.js';

async function runTest() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(config.MONGO_URI);
        console.log('Connected.');

        // 1. Create or find a test seller
        const email = 'test_seller_antigravity@example.com';
        let seller = await userModel.findOne({ email });
        if (!seller) {
            console.log('Creating test seller...');
            seller = await userModel.create({
                email,
                contact: '1234567890',
                fullname: 'Test Seller Antigravity',
                role: 'seller',
                password: 'password123'
            });
        }
        console.log('Test seller ID:', seller._id);

        // 2. Generate token
        const token = jwt.sign({ id: seller._id }, config.JWT_SECRET, { expiresIn: '1d' });

        // 3. Start the server on port 3001
        const PORT = 3001;
        const server = app.listen(PORT, async () => {
            console.log(`Test server listening on port ${PORT}`);

            try {
                // 4. Send a POST request to create a product using native FormData
                const formData = new FormData();
                formData.append('title', 'Classic Raw Denim');
                formData.append('description', 'High-quality indigo raw denim jeans.');
                formData.append('priceAmount', '2999');
                formData.append('priceCurrency', 'INR');
                
                // Add a dummy text file as a mock image
                const file = new Blob(['dummy image data'], { type: 'image/png' });
                formData.append('images', file, 'jeans.png');

                console.log('Sending POST request to create product...');
                const response = await fetch(`http://localhost:${PORT}/api/products`, {
                    method: 'POST',
                    headers: {
                        'Cookie': `token=${token}`
                    },
                    body: formData
                });

                const status = response.status;
                const result = await response.json();

                console.log('POST Response Status:', status);
                console.log('POST Response Body:', JSON.stringify(result, null, 2));

                if (status === 201) {
                    console.log('✅ POST /api/products works perfectly!');
                    
                    const productId = result.product._id;

                    // 5. Test GET /api/products/seller
                    console.log('Sending GET request to fetch seller products...');
                    const sellerRes = await fetch(`http://localhost:${PORT}/api/products/seller`, {
                        method: 'GET',
                        headers: {
                            'Cookie': `token=${token}`
                        }
                    });
                    console.log('GET Seller Status:', sellerRes.status);
                    const sellerResult = await sellerRes.json();
                    console.log('GET Seller Products Count:', sellerResult.length);

                    // 6. Test GET /api/products
                    console.log('Sending GET request to fetch all products...');
                    const allRes = await fetch(`http://localhost:${PORT}/api/products`);
                    console.log('GET All Status:', allRes.status);
                    const allResult = await allRes.json();
                    console.log('GET All Products Count:', allResult.length);

                    // 7. Test GET /api/products/detail/:id
                    console.log(`Sending GET request to fetch product detail for ID: ${productId}...`);
                    const detailRes = await fetch(`http://localhost:${PORT}/api/products/detail/${productId}`);
                    console.log('GET Detail Status:', detailRes.status);
                    const detailResult = await detailRes.json();
                    console.log('GET Detail Product Title:', detailResult.title);

                    // 8. Test POST /api/products/:productId/variants
                    console.log('Sending POST request to add a variant...');
                    const variantFormData = new FormData();
                    variantFormData.append('size', 'M');
                    variantFormData.append('color', 'Blue');
                    variantFormData.append('priceAmount', '3199');
                    variantFormData.append('priceCurrency', 'INR');
                    variantFormData.append('stock', '50');
                    variantFormData.append('images', new Blob(['variant image data'], { type: 'image/png' }), 'variant-blue.png');

                    const variantRes = await fetch(`http://localhost:${PORT}/api/products/${productId}/variants`, {
                        method: 'POST',
                        headers: {
                            'Cookie': `token=${token}`
                        },
                        body: variantFormData
                    });

                    console.log('POST Variant Status:', variantRes.status);
                    const variantResult = await variantRes.json();
                    console.log('POST Variant Response:', JSON.stringify(variantResult, null, 2));

                    if (variantRes.status === 201) {
                        console.log('✅ POST /api/products/:productId/variants works perfectly!');
                    } else {
                        console.error('❌ Variant creation failed!');
                    }

                    // Clean up test product
                    console.log('Cleaning up test product from DB...');
                    await productModel.findByIdAndDelete(productId);
                    console.log('Cleanup done.');
                } else {
                    console.error('❌ Product creation failed!');
                }

            } catch (err) {
                console.error('Test execution error:', err);
            } finally {
                server.close();
                await mongoose.disconnect();
                console.log('Server stopped and database disconnected.');
            }
        });

    } catch (err) {
        console.error('Failed to run test:', err);
        process.exit(1);
    }
}

runTest();

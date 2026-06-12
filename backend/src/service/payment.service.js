import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

class PaymentService {
    constructor() {
        this.razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
            key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
        });
    }

    /**
     * Create a new order in Razorpay
     * @param {number} amount Amount in smallest currency unit (e.g., paise for INR)
     * @param {string} currency Currency code (e.g., 'INR')
     * @param {string} receipt Unique receipt id
     * @returns {Promise<Object>} Razorpay order object
     */
    async createOrder(amount, currency = 'INR', receipt) {
        const options = {
            amount: amount, 
            currency: currency,
            receipt: receipt,
            payment_capture: 1 // Auto capture
        };

        try {
            const order = await this.razorpay.orders.create(options);
            return order;
        } catch (error) {
            console.error("Razorpay order creation error:", error);
            throw new Error('Failed to create Razorpay order');
        }
    }

    /**
     * Verify the payment signature from Razorpay
     * @param {string} orderId Razorpay order ID
     * @param {string} paymentId Razorpay payment ID
     * @param {string} signature Razorpay signature
     * @returns {boolean} True if signature is valid
     */
    verifySignature(orderId, paymentId, signature) {
        const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';
        const generatedSignature = crypto
            .createHmac('sha256', secret)
            .update(orderId + "|" + paymentId)
            .digest('hex');

        return generatedSignature === signature;
    }
}

export default new PaymentService();

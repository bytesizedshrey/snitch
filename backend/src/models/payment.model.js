import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order',
        required: true
    },
    razorpayOrderId: {
        type: String,
        required: true,
        unique: true
    },
    razorpayPaymentId: {
        type: String,
        required: true,
        unique: true
    },
    razorpaySignature: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'success'
    }
}, { timestamps: true });

const paymentModel = mongoose.model('payment', paymentSchema);

export default paymentModel;

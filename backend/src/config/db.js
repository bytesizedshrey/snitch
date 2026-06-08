import { config } from './config.js';
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log('🍃 MongoDB connected and locked in');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        throw error;
    }
};

export default connectDB;
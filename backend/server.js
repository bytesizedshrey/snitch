import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/db.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

// waking up the server from its beauty sleep
const startServer = async () => {
    try {
        // ayo db, pull up
        await connectDB();

        app.listen(PORT, () => {
            console.log(` server vibing on port ${PORT}`);
        });

    } catch (error) {
        // bro really failed the spawn
        console.log('💀 server said "not today":', error.message);
        process.exit(1); // rage quit
    }
};

startServer();
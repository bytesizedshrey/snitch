import multer from 'multer';

// Use memory storage to keep file buffers in memory before uploading to ImageKit
const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

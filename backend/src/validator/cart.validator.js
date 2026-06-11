import { body, param, validationResult } from "express-validator";

function validateRequest(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validation Error",
            errors: errors.array()
        });
    }

    next();
}

export const addToCartValidator = [
    body('productId').notEmpty().withMessage('productId is required').isMongoId().withMessage('Invalid productId format'),
    body('variantId').optional({ nullable: true, checkFalsy: true }).isMongoId().withMessage('Invalid variantId format'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('quantity must be an integer greater than 0'),
    validateRequest
];

export const updateCartItemValidator = [
    param('itemId').notEmpty().withMessage('itemId is required').isMongoId().withMessage('Invalid itemId format'),
    body('quantity').notEmpty().withMessage('quantity is required').isInt({ min: 1 }).withMessage('quantity must be an integer greater than 0'),
    validateRequest
];

export const removeCartItemValidator = [
    param('itemId').notEmpty().withMessage('itemId is required').isMongoId().withMessage('Invalid itemId format'),
    validateRequest
];

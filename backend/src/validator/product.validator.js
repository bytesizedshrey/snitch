import { body, validationResult } from "express-validator";

function validateRequest(req, res, next) {
    const errors = validationResult(req);

    // Check if any files were uploaded (either single or multiple) or if images exist in body
    const hasFiles = (req.files && req.files.length > 0) || req.file;
    const hasBodyImages = req.body && req.body.images;
    if (!hasFiles && !hasBodyImages) {
        return res.status(400).json({
            message: "Validation Error",
            errors: [{ msg: "image is required" }]
        });
    }

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validation Error",
            errors: errors.array()
        });
    }

    next();
}

export const createProductValidator = [
    body('title')
        .notEmpty().withMessage('title is required.')
        .isLength({ min: 3 }).withMessage('title must be at least 3 characters.'),

    body('description')
        .notEmpty().withMessage('description is required.')
        .isLength({ min: 10 }).withMessage('description must be at least 10 characters.'),

    body('priceAmount')
        .notEmpty().withMessage('price is required.')
        .isNumeric().withMessage('price must be a number.'),

    body('priceCurrency')
        .notEmpty().withMessage('priceCurrency is required.')
        .isIn(['USD', 'EUR', 'GBP', 'JPY', 'INR'])
        .withMessage('priceCurrency must be a valid currency.'),

    validateRequest
];
import { body , validationResult} from "express-validator";

function validateRequest(req,res,next){
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(400).json({errors : errors.array()})
    }
    //Without next() request may hang forever because it never reaches the next function.
    next()
}

export const validateRegisterUser = [
    body("email")
    .isEmail().withMessage('invalid email.'),

    body('contact')
    .notEmpty().withMessage('contact is required.')
    .matches(/^\d{10}$/).withMessage('contact must be a 10-digit number.'),

    body('password')
    .isLength({min : 6}).withMessage('password must be of at least 6 char long.'),

    body('fullname')
    .notEmpty().withMessage('full name is erquired')
    .isLength({min : 3}).withMessage('full name must be of atleast 3 character.'),

    validateRequest
]
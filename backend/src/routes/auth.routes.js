import { Router } from 'express'
import { validateRegisterUser, validateLoginUser } from '../validator/auth.validator.js'
import { register, login } from '../controllers/auth.controller.js'
import passport from 'passport'

const router = Router()

router.post('/register', validateRegisterUser, register)
router.post('/login', validateLoginUser, login)

// Route to initiate Google OAuth flow
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
)

// Callback route that Google will redirect to after authentication
router.get(
    '/google/callback',
    passport.authenticate('google', {
        session: false
    })
)


export default router
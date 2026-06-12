import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { validateRegisterUser, validateLoginUser } from '../validator/auth.validator.js'
import { register, login, googleCallback, getMe } from '../controllers/auth.controller.js'
import passport from 'passport'
import { config } from '../config/config.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';

const router = Router()

// Strict rate limit for auth routes to prevent credential stuffing
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 login/register requests per `window`
    message: 'Too many authentication attempts from this IP, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
})

router.post('/register', authLimiter, validateRegisterUser, register)
router.post('/login', authLimiter, validateLoginUser, login)
router.get('/me', authenticateUser, getMe)
router.post('/logout', (req, res) => {
    res.clearCookie('token')
    return res.status(200).json({ success: true, message: 'Logged out successfully' })
})

// Route to initiate Google OAuth flow
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false
    })
)

// Callback route that Google will redirect to after authentication
router.get(
    '/google/callback',
    passport.authenticate('google', {
      session: false,
      failureRedirect: config.NODE_ENV == 'development' ? 'http://localhost:5173/login' : '/login'
    }),
    googleCallback
  );

export default router
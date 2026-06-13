import express from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import cors from 'cors'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

// Security imports
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

// Routes
import authRouter from './routes/auth.routes.js'
import productRouter from './routes/product.routes.js'
import cartRouter from './routes/cart.routes.js'

import { config } from './config/config.js'
import { errorHandler } from './middlewares/error.middleware.js'

const app = express()

// Trust proxy if we are behind a load balancer (important for rate limiting)
app.set('trust proxy', 1)

// 1. Secure HTTP headers
app.use(helmet())

// 2. Global Rate Limiting
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per `window`
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, 
    legacyHeaders: false,
})
app.use('/api', globalLimiter)

app.use(morgan("dev"))
app.use(express.json({ limit: '10kb' })) // Body limit to prevent payload bloat
app.use(express.urlencoded({extended: true, limit: '10kb'}))
app.use(cookieParser())

// Data sanitization packages (xss-clean, express-mongo-sanitize) 
// have been removed because they attempt to reassign req.query,
// which is strictly a getter in Express 5.x and causes crashes.

app.use(cors({
    origin : config.NODE_ENV === 'production' 
        ? ['https://snitch-two.vercel.app'] 
        : ['http://localhost:5173', 'http://localhost:5174'],
    methods : ['GET','POST','PUT','DELETE','PATCH'],
    credentials : true
}))

app.use(passport.initialize())

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
    proxy: true
},(accessToken,refreshToken,profile,done)=>{
    return done(null,profile)
}))

app.get('/',(req,res)=>{
    res.status(200).json({message : 'server is running'})
})

app.use('/api/auth', authRouter)
app.use('/api/products', productRouter)
app.use('/api/cart', cartRouter)

// Global Error Handler MUST be the last middleware
app.use(errorHandler)

export default app
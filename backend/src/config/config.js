//config.js = the security guard that loads secrets from .env, checks if they exist, and hands them neatly to the app.
import dotenv from 'dotenv'
dotenv.config()

if(!process.env.MONGO_URI){
    throw new Error('MONGO_URI is not defined in env variable.')
}
if(!process.env.JWT_SECRET){
    throw new Error('JWT_SECRET is not defined in env variable.')
}

if(!process.env.GOOGLE_CLIENT_ID){
    throw new Error('GOOGLE_CLIENT_ID is not defined in env variable.')
}
if(!process.env.GOOGLE_CLIENT_SECRET){
    throw new Error('GOOGLE_CLIENT_SECRET is not defined in env variable.')
}

export const config = {
    MONGO_URI : process.env.MONGO_URI,
    JWT_SECRET : process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID : process.env.GOOGLE_CLIENT_ID ,
    GOOGLE_CLIENT_SECRET : process.env.GOOGLE_CLIENT_SECRET,
    NODE_ENV : process.env.NODE_ENV || 'development'
} 
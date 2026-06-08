//config.js = the security guard that loads secrets from .env, checks if they exist, and hands them neatly to the app.
import dotenv from 'dotenv'
dotenv.config()

if(!process.env.MONGO_URI){
    throw new Error('MONGO_URI is not defined in env variable.')
}
if(!process.env.JWT_SECRET){
    throw new Error('JWT_SECRET is not defined in env variable.')
}

export const config = {
    MONGO_URI : process.env.MONGO_URI,
    JWT_SECRET : process.env.JWT_SECRET
}
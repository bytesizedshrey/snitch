import { config } from "../config/config.js";
import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken'

//token stuff
async function sendTokenResponse(user,res,message){
    const token = jwt.sign({
        id : user._id
    },config.JWT_SECRET,{
        expiresIn : "7d"
    })

    //store token in cookie
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    //success
    res.status(200).json({
        message,
        success : true,
        user : {
            id : user._id,
            email : user.email,
            contact : user.contact,
            fullname : user.fullname,
            role : user.role
        }
    })
}

//register controller
export const register = async (req,res) => {
    const {email,contact,password,fullname,isSeller} = req.body

    try{
        const existingUser = await userModel.findOne({
            $or : [
                {email},
                {contact}
            ]
        })

        if(existingUser){
            return res.status(400).json({message : 'user with this email or contact already exists.'})
        }
        //create user
        const user = await userModel.create({
            email,
            contact,
            password,
            fullname,
            role : isSeller ? 'seller' : 'buyer'
        })

        //final response
        await sendTokenResponse(user,res,"user registered suncessfully")

    } catch (error) {
        console.log(error)
        return res.status(500).json({message : 'server error'})
    }
}

//login controller
export const login = async (req,res) => {
    const {email,password} = req.body
    
    const user = await userModel.findOne({email})

    if(!user){
        return res.status(400).json({message : "Invalid email or password"})
    }

    const isMatch = await user.comparePassword(password)
    if(!isMatch){
        return res.status(400).json({message : "Invalid email or password"})
    }

    await sendTokenResponse(user,res,"user logged in sucessfully")

}

//googleCallback handles the user after successful Google login, finds/creates them in DB, generates a login token, and redirects them to the frontend.
export const googleCallback = async (req,res) => {
    try {
        const {id,displayName,emails,photos} = req.user //req.user comes from Passport.js after successful Google login.
        const email = emails[0].value;
        const profilePic = photos[0].value;

        //Check if user already exists
        let user = await userModel.findOne({
            email
        })

        //if user dosnt exist then create the user
        if(!user){
            user = await userModel.create({
                email,
                googleId : id,
                fullname : displayName,
                role : 'seller'
            })
        } else if (user.role !== 'seller') {
            // Automatically upgrade existing buyer test users to seller role
            user.role = 'seller'
            await user.save()
        }

        //create token
        const token = jwt.sign({
            id : user._id,
        },
        config.JWT_SECRET,{
            expiresIn : '7d'
        })

        //store token in cookie so the user remains authenticated on the frontend
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        //This just redirects user to frontend.
        res.redirect('http://localhost:5173/')
    } catch (error) {
        console.error("Google Auth Callback Error:", error)
        res.redirect('http://localhost:5173/login?error=google_auth_failed')
    }
}

export const getMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        return res.status(200).json({
            success: true,
            user: {
                id: req.user._id,
                email: req.user.email,
                contact: req.user.contact,
                fullname: req.user.fullname,
                role: req.user.role
            }
        })
    } catch (error) {
        console.error('Get Me Error:', error)
        return res.status(500).json({ message: 'Server error' })
    }
} 
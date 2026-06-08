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
    res.cookie("token",token)

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
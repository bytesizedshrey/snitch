import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email : {type : String, required : true, unique : true},
    contact : {type : String, required : false},
    password : {type : String, required : function(){
        return !this.googleId
    }},
    fullname : {type : String, required : true},
    role : {
        type : String,
        enum : ["buyer","seller"],
        default : 'buyer'
    },
    googleId:{
        type : String
    }
})

//"Wait! Before entering the database, security check!"
userSchema.pre("save",async function () {
    //Did the password even change?
    if(!this.password || !this.isModified('password')) return

    //Secret password blender
    const hash = await bcrypt.hash(this.password,10)
    this.password = hash //No plain password allowed.
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password,this.password)
}

const userModel = mongoose.model('user', userSchema)

export default userModel
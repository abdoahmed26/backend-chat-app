import { User } from "../models/userSchema.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"

export const login = async(req,res)=>{
    const {email,password} = req.body

    const user = await User.findOne({email: email})
    if(!user){
        return res.status(400).json({status:"error",message: "user not found"})
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(user && isMatch){
        const token = jwt.sign({id:user._id,email:user.email},process.env.JWT_SRECT_KEY,{expiresIn:"1d"})
        return res.status(200).json({status:"success",data:{token}})
    }
    else {
        return res.status(404).json({status:"error",message: "email or password is not correct"})
    }
}

export const register = async(req,res)=>{
    const {name,email,password} = req.body

    const oldUser = await User.findOne({email})
    if(oldUser){
        return res.status(400).json({status:"error",message: "email already exists"})
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const newUser = new User(
    {
        name,
        email,
        password:hashedPassword,
        profile_pic:req.file?.path
    })
    newUser.save().then(()=>{
        return res.status(200).json({status:"success",message: "User registered successfully"})
    }).catch(err => {
        return res.status(404).json({status:"error",message: err.message})
    } )
}

export const loginGoogle = async(req,res)=>{
    try {
        const user = req.user
        const oldUser = await User.findOne({email: user.email})
        if(oldUser){
            const token = jwt.sign({id:oldUser._id,email:oldUser.email},process.env.JWT_SRECT_KEY,{expiresIn:"1d"})
            res.cookie("token",token,{expires:new Date(Date.now() + 24 * 60 * 60 * 1000)})
        }
        else{
            const pass = crypto.randomBytes(6).toString('hex')
            const hashedPassword = await bcrypt.hash(pass,10)
            const newUser = new User({
                email:user.email,
                name:user.displayName,
                password:hashedPassword,
            })
            await newUser.save()
            const token = jwt.sign({id:newUser._id,email:newUser.email},process.env.JWT_SRECT_KEY,{expiresIn:"1d"})
            res.cookie("token",token,{expires:new Date(Date.now() + 24 * 60 * 60 * 1000)})
        }
        return res.redirect(`${process.env.FRONT_END_URL}`)
    } catch (err) {
        return res.status(404).json({status:"error",message: err.message})
    }
}
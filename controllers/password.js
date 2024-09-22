import { Code } from '../models/codeSchema.js';
import { sendEmail } from '../utils/sendEmail.js';
import { User } from './../models/userSchema.js';
import crypto from 'crypto'
import bcrypt from 'bcryptjs';
export const confirmEmail = async(req,res)=>{
    const {email} = req.body
    try {
        const user = await User.findOne({email})
    
        if(!user){
            return res.status(404).json({status:"error",message: "User not found"})
        }
        
        const code = crypto.randomBytes(3).toString('hex')
        const codeExpired = Date.now() + 300000;
    
        sendEmail(user.name,email,code).then(async()=>{
            await Code.deleteMany({userId: user._id})
            const newCode = new Code({
                code,
                codeExpired,
                userId: user._id
            })
            newCode.save().then(()=>{
                return res.status(200).json({status:"success",message: "Verification code sent to your email"})
            }).catch((err)=>{
                return res.status(404).json({status:"error",message: err.message})
            })
        }).catch((err)=>{
            return res.status(404).json({status:"error",message: err.message})
        })
    }catch (error) {
        return res.status(404).json({status:"error",message: error.message})
    }
}

export const confirmCode = async(req,res)=>{
    const {email,code} = req.body
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({status:"error",message: "User not found"})
        }
    
        const checkCode = await Code.findOne({code,userId:user._id})
    
        if(!checkCode){
            return res.status(404).json({status:"error",message: "Code not found"}) 
        }
        if(checkCode.codeExpired < Date.now()){
            await Code.deleteOne({_id:checkCode._id})
            return res.status(404).json({status:"error",message: "Code expired"})
        }
        else{
            return res.status(200).json({status:"success",message: "Code verified successfully"})
        }
    }catch (error) {
        return res.status(404).json({status:"error",message: error.message})
    }
}

export const resetPassword = async(req,res)=>{
    const {email,code,password} = req.body
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({status:"error",message: "User not found"})
        }
        const checkCode = await Code.findOne({code,userId:user._id})
    
        if(!checkCode){
            return res.status(404).json({status:"error",message: "Code not found"}) 
        }
        if(checkCode.codeExpired < Date.now()){
            await Code.deleteOne({_id:checkCode._id})
            return res.status(404).json({status:"error",message: "Code expired"})
        }
        else{
            const hashedPassword = await bcrypt.hash(password,10)
            await User.updateOne({_id:user._id},{password:hashedPassword})
            await Code.deleteOne({_id:checkCode._id})
            return res.status(200).json({status:"success",message: "Your password changed successfully"})
        }
    }catch (error) {
        return res.status(404).json({status:"error",message: error.message})
    }
}
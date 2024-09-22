import { User } from "../models/userSchema.js"

export const getUser = (req,res)=>{
    User.findById(req.user.id,{"__v":false,"password":false})
    .then((user)=>{
        if(!user){
            return res.status(404).json({status:"fail",message:"User not found"})
        }
        return res.json({status:"success",data:{user}})
    }).catch(err=> res.status(404).json({status:"fail",message:err.message}))
}

export const updateUser = (req,res)=>{
    User.findByIdAndUpdate(req.user.id,{...req.body,profile_pic:req.file?.path},{new:true,select:{"__v":false,"password":false}})
    .then((updatedUser)=>{
        if(!updatedUser){
            return res.status(404).json({status:"fail",message:"User not found"})
        }
        return res.status(200).json({status:"success",data:{user:updatedUser}})
    }).catch(err=> res.status(404).json({status:"fail",message:err.message}))
}

export const getAllUsers = (req,res)=>{
    User.find({},{"__v":false,"password":false}).then((users)=>{
        return res.status(200).json({status:"success",data:{users}})
    }).catch(err=>res.status(404).json({status:"error",message:err.message}))
}

export const getUserById = (req,res)=>{
    const {id} = req.params
    User.findById(id,{"__v":false,"password":false})
    .then((user)=>{
        if(!user){
            return res.status(404).json({status:"fail",message:"User not found"})
        }
        return res.json({status:"success",data:{user}})
    }).catch(err=> res.status(404).json({status:"fail",message:err.message}))
}
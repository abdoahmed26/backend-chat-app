import jwt from 'jsonwebtoken';

export const verifyToken = (req,res,next)=>{
    if(!req.headers.authorization){
        return res.status(401).json({status:"fail",message:"Token not provided"})
    }
    const token = req.headers.authorization.split(" ")[1]
    jwt.verify(token,process.env.JWT_SRECT_KEY,(err,user)=>{
        if(err){
            return res.status(403).json({status:"fail",message:"Token is not valid"})
        }
        req.user = user
        next()
    })
}
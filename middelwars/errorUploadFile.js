
export const errorUploadFile = (req,res,next)=>{
    if(req.errorUploadFile){
        return res.status(401).json({status:"fail",message:"this file is not a valid upload"});
    }
    next();
}
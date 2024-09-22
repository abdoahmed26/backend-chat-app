import jwt from 'jsonwebtoken';

export const getUserByToken = async(token)=>{
    try {
        const user = jwt.verify(token,process.env.JWT_SRECT_KEY)
        return user
    }catch(err){
        console.log(err.message)
    }
}
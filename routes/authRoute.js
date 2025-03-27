import express  from 'express';
import { login, loginGoogle, register } from '../controllers/auth.js';
import { upload } from '../middelwars/uploadFile.js';
import { errorUploadFile } from '../middelwars/errorUploadFile.js';
import passport from 'passport';

export const authRouter = express.Router()

authRouter.post("/login",login)

authRouter.post("/register",upload.single("profile_pic"),errorUploadFile,register)

authRouter.get("/google", passport.authenticate("google", { scope: [ 'email', 'profile' ] }));

authRouter.get('/google/callback',passport.authenticate('google',{
    failureRedirect:`/api/v1/auth/google/failure`,
    successRedirect:`/api/v1/auth/google/success`
}))

authRouter.get('/google/success',loginGoogle)

authRouter.get('/google/failure',(req,res)=>{
    res.redirect(`${process.env.FRONT_END_URL}`)
})

authRouter.get('/github',passport.authenticate('github', { scope: [ 'user:email' ] }));

authRouter.get('/github/callback', passport.authenticate('github', { 
    failureRedirect: '/api/v1/auth/google/failure',
    successRedirect: '/api/v1/auth/google/success'
}));
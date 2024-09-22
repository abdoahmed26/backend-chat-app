import express  from 'express';
import { login, register } from '../controllers/auth.js';
import { upload } from '../middelwars/uploadFile.js';
import { errorUploadFile } from '../middelwars/errorUploadFile.js';

export const authRouter = express.Router()

authRouter.post("/login",login)

authRouter.post("/register",upload.single("profile_pic"),errorUploadFile,register)
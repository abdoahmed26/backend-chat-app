import express  from 'express';
import { verifyToken } from '../middelwars/verifyToken.js';
import { getUser, updateUser, getAllUsers, getUserById } from '../controllers/users.js';
import { upload } from '../middelwars/uploadFile.js';
import { errorUploadFile } from '../middelwars/errorUploadFile.js';

export const userRouter = express.Router()

userRouter.get("/",verifyToken,getUser)
userRouter.get("/all",verifyToken,getAllUsers)
userRouter.get("/:id",verifyToken,getUserById)
userRouter.put("/",verifyToken,upload.single("profile_pic"),errorUploadFile,updateUser)
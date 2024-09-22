import express from 'express';
import { confirmCode, confirmEmail, resetPassword } from '../controllers/password.js';

export const passwordRouter = express.Router();

passwordRouter.post("/confirmEmail",confirmEmail)

passwordRouter.post("/confirmCode",confirmCode)

passwordRouter.post("/resetPassword",resetPassword)
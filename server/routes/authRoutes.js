import express from 'express'
import { login, logOut, register, resetPassword, sendRestOtp, sendverifyOtp, verifyEmail, isAuthenticated } from '../controllers/authControllers.js';
import userAuth from '../middleware/userAuth.js';

 const authRouter = express.Router();

 authRouter.post("/register", register);
 authRouter.post("/login", login);
 authRouter.post("/logout", logOut);
 authRouter.post("/send-verify-otp", userAuth, sendverifyOtp);
 authRouter.post("/verify-account", userAuth, verifyEmail);
 authRouter.get("/is-auth", userAuth, isAuthenticated);
 authRouter.post("/send-reset-otp", sendRestOtp);
 authRouter.post("/resetPassword", resetPassword);


 export default authRouter
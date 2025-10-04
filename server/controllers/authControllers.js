import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

// user Registration Contoller 
export const register = async (req,res)=>{
    const {name,email,password}=req.body;

    if(!name || !email || !password){
        return res.json({success:false,message:"missing Details"})
    }

    try{

        const existingUser= await userModel.findOne({email})


        if(existingUser){
            return res.json({success:false, message:"User Already Exits"})
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new userModel({name,email,password:hashedPassword});

        await user.save();


        const token = jwt.sign({id: user._id},process.env.JWT_SECRET, {expiresIn:"7d"});

        res.cookie('token', token, {
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production',
            sameSite : process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge : 7 * 24 * 60 * 60 * 1000
        });

        // sending Wlcome Email 
        const mailOptions ={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"Welcome To Modern Authentication",
            text:`Welcome to Authentication Website. Your Accout Has been created with email id :${email}`
        }

        await transporter.sendMail(mailOptions);

        return res.json({
            success:true
        });
    }
    catch(err){
            return res.json({success:false, message:err.message})
    }
}

// user Login Controller  

export const login = async (req,res)=>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.json({success:false, message: "Email and Password are required"})
    }

    try{
        console.log("Login API hit:", req.body);
        const user = await userModel.findOne({ email: req.body.email.trim() });
        console.log("User from DB:", user);

        if(!user){
            return res.json({success:false, message:" Invalid email"})
        }
            const isMatch = await bcrypt.compare(password,user.password);

            if(!isMatch){
                return res.json({success:false, message:"Invalid Password"})
            }

            

            const token = jwt.sign({id: user._id},process.env.JWT_SECRET, {expiresIn:"7d"});

        res.cookie('token', token, {
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production',
            sameSite : process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge : 7 * 24 * 60 * 60 * 1000
        });

        return res.json({success:true})
    }
    catch(err){
        return res.json({success:false, message : err.message});
    }
}



// logOut Controller 

export const logOut = async (req,res)=>{
    try{
        res.clearCookie("token",{
             httpOnly : true,
            secure : process.env.NODE_ENV === 'production',
            sameSite : process.env.NODE_ENV === "production" ? "none" : "strict",
        })


        return res.json({success:true, message:"Logged Out"})
            
    }
    catch(error){
        return res.json({success:false, message:error.message})
    }
}


// verification process 
// Send Verification OTP
// controllers/authControllers.js

export const sendverifyOtp = async (req, res) => {
  try {
    const userId = req.user.userId; // JWT-based userId
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.isAccountVerified) return res.status(400).json({ success: false, message: "Account Already Verified" });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24hrs
    await user.save();

     console.log("Generated OTP:", otp, "for email:", user.email);

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}. Verify your account using this OTP.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Verification OTP sent to your Email" });
  } catch (error) {
    console.error("sendverifyOtp error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// Verify Email
export const verifyEmail = async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {

     const userId = req.user?.userId;
    if (!userId) return res.json({ success: false, message: "Unauthorized" });

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (!user.verifyOtp || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();

    return res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


// check is user is autheticated 

export const isAuthenticated = async (req,res)=>{
  try{
    return res.json({success:true, user: req.user});
  }
  catch(error){
    return res.json({success:false, message:error.message});
  }
}



// OTP Rest Controller 


export const sendRestOtp = async (req,res)=>{
    const {email}= req.body;

    if(!email){
        return res.json({success:false, message:"Email is required"})
    };


    try{

        const user= await userModel.findOne({email});
        if(!user){
        return res.json({success:false, message:"User Not Found2"})
        }

         const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 24 hrs expiry

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Rest OTP",
      text: `Your OTP for resetting your password is ${otp}.Use this OTP to proceed with resetting your password`,
    };

    await transporter.sendMail(mailOption);
    res.json({success: true, message:"OTP sent to your email"});

    }
    catch(error){
        return res.json({success:false, message:error.message})
    }
}



// Reset User Password 

export const resetPassword = async(req,res)=>{
    const {email, otp, newPassword}= req.body;


    if(!email || !otp || !newPassword){
        return res.json({success: false, message: " Email, OTP, and new password are required"})
    }

    try{
        const user = await userModel.findOne({email});

        if(!user){
        return res.json({success: false, message: "User NoT Found3"})
        }

        if(user.resetOtp === "" || user.resetOtp !== otp){
        return res.json({success: false, message: "Invalid OTP"})
        }

        if(user.resetOtpExpireAt < Date.now()){
        return res.json({success: false, message: "OTP is Expired"})
        }

        const hashedPassword = await bcrypt.hash(newPassword,10);


        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt= 0


        await user.save();

        return res.json({success: true, message: "Password has been reset Successfully"})
    }
    catch(error){
        return res.json({success: false, message:error.message})
    }
}
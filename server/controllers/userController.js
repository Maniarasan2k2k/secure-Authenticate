import userModel from "../models/userModel.js";


export const getUserData = async (req,res)=>{
    try{
        const {userId} = req.user;

        
        if (!userId) {
            return res.json({ success: false, message: "User ID required" });
        }
        // console.log(req.body);
        

        const user = await userModel.findById(userId);
        
        if(!user){
            return res.json({success:false, message:"USer not Found"})
        }

        res.json({
                success:true,
                userData:{
                name: user.name,
                isAccountVerified: user.isAccountVerified   
            }
        });

    }
    catch(error){
        return res.json({success: false, message:error})
    }
}

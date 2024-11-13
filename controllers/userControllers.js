import { User } from "../models/userModel.js";
import bcrypt from 'bcrypt'; 
import { generateToken } from "../utils/token.js";


export const userSignup = async(req,res,next)=>{
    try {

        const {name,email,password,mobile,profilePic}=req.body;
        
        if(!name || !email || !password || !mobile){
            return res.status(400).json({message:"all fields required"});
        }
        
        const userExist =await User.findOne({email:email});
        if (userExist){
            return res.status(400).json({message:"user alredy exist"});
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
       

        const newUser = new User({name,email,password:hashedPassword,mobile,profilePic});
        await newUser.save();

        const token= generateToken(newUser,'user');

        res.cookie('token',token)

        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};
//     } catch (error) {
//         res.status(error,statusCode || 500).json({message:error.message || 'internal server error'});
//     }
// }

export const userLogin = async(req,res,next)=>{
    try {

        const {email,password}=req.body;
        
        if(!email || !password ){
            return res.status(400).json({message:"all fields required"});
        }
        
        const userExist =await User.findOne({email:email});
        if (!userExist){
            return res.status(400).json({message:"user does not exist"});
        }

        const isPasswordMatch = bcrypt.compareSync(password,userExist.password);

        if(!isPasswordMatch){
            return res.status(400).json({message:"user not authenticated"})

        }


        const token= generateToken(userExist,'user');

        res.cookie('token',token);

        
        res.status(201).json({ message: "User login successfull"});
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};



export const userProfile= async(req,res,next)=>{
    try {

        const userId = req.user.id;
        const userProfile = await User.findById(userId).select("==password");

        res.status(201).json({ message: "User login successfull",data:userProfile});
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};


export const userLogout= async(req,res)=>{
    try {
        res.clearCookie('token');
        res.status(201).json({ message: "User loged out "});
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};


export const checkUser= async(req,res)=>{
    try {
        res.status(201).json({ message: "User Autherized "});
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};
export const userResetPassword = async (req, res, next) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ message: "Email and new password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};
export const userProfileUpdate = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { name, mobile, profilePic } = req.body;

        const updateduser = await User.findByIdAndUpdate(
            userId,
            { name, mobile, profilePic },
            { new: true }
        );

        res.status(200).json({ message: "Profile updated successfully", data: updateduser });
    } catch (error) {
        console.error('Error during profile update:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};
export const userDeleteAccount = async (req, res, next) => {
    try {
        const userId = req.user.id;

        await User.findByIdAndDelete(userId);
        res.clearCookie('token');
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error('Error during account deletion:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};
import mongoose from "mongoose";
import {Admin} from "../models/adminModel.js"
import bcrypt from 'bcrypt'; 
import { generateToken } from "../utils/token.js";
import { User } from "../models/userModel.js";
import {Mentor} from "../models/mentorModel.js";
import {Course} from "../models/courseModel.js";

export const adminSignup = async(req,res,next)=>{
    try {

        const {name,email,password,mobile,profilePic}=req.body;
        
        if(!name || !email || !password || !mobile){
            return res.status(400).json({message:"all fields required"});
        }
        
        const userExist =await Admin.findOne({email:email});
        if (userExist){
            return res.status(400).json({message:"admin alredy exist"});
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
       

        const newUser = new Admin({name,email,password:hashedPassword,mobile,profilePic});
        await newUser.save();

        const token= generateToken(newUser,'admin');

        res.cookie('token',token)

        res.status(201).json({ message: "admin created successfully", user: newUser });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};
//     } catch (error) {
//         res.status(error,statusCode || 500).json({message:error.message || 'internal server error'});
//     }
// }

export const adminLogin = async(req,res,next)=>{
    try {

        const {email,password}=req.body;
        
        if(!email || !password ){
            return res.status(400).json({message:"all fields required"});
        }
        
        const userExist =await Admin.findOne({email:email});
        if (!userExist){
            return res.status(400).json({message:"admin does not exist"});
        }

        const isPasswordMatch = bcrypt.compareSync(password,userExist.password);

        if(!isPasswordMatch){
            return res.status(400).json({message:"admin not authenticated"})

        }


        const token= generateToken(userExist,'admin');

        res.cookie('token',token);

        
        res.status(201).json({ message: "admin login successfull"});
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};



export const adminProfile= async(req,res,next)=>{
    try {

        const userId = req.user.id;
        const userProfile = await Admin.findById(userId).select("==password");

        res.status(201).json({ message: "admin login successfull",data:userProfile});
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};


export const adminLogout= async(req,res)=>{
    try {
        res.clearCookie('token');
        res.status(201).json({ message: "admin loged out "});
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};
export const adminResetPassword = async (req, res, next) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ message: "Email and new password are required" });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        admin.password = hashedPassword;
        await admin.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};
export const adminProfileUpdate = async (req, res, next) => {
    try {
        const adminId = req.user.id;
        const { name, mobile, profilePic } = req.body;

        const updatedAdmin = await Admin.findByIdAndUpdate(
            adminId,
            { name, mobile, profilePic },
            { new: true }
        );

        res.status(200).json({ message: "Profile updated successfully", data: updatedAdmin });
    } catch (error) {
        console.error('Error during profile update:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};
export const adminDeleteAccount = async (req, res, next) => {
    try {
        const adminId = req.user.id;

        await Admin.findByIdAndDelete(adminId);
        res.clearCookie('token');
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error('Error during account deletion:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};
export const fetchUsers = async (req, res, next) => {
    try {
        const users = await User.find(); // Replace `User` with the correct model if different
        res.status(200).json({ message: "Users fetched successfully", data: users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};
export const fetchMentors = async (req, res, next) => {
    try {
        const mentors = await Mentor.find(); // Replace `Mentor` with the correct model
        res.status(200).json({ message: "Mentors fetched successfully", data: mentors });
    } catch (error) {
        console.error('Error fetching mentors:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};
export const fetchCourses = async (req, res, next) => {
    try {
        const courses = await Course.find(); // Replace `Course` with the correct model
        res.status(200).json({ message: "Courses fetched successfully", data: courses });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};
export const checkAdmin = (req, res, next) => {
    try {
        if (req.user.role === 'admin') {
            res.status(200).json({ message: "User is an admin" });
        } else {
            res.status(403).json({ message: "Access denied" });
        }
    } catch (error) {
        console.error('Error checking admin status:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};
export const freezeUser = async (req, res) => {
    try {
        const userId = req.params.userId; // Extract userId from request parameters

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { isFrozen: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User account frozen", user });
    } catch (error) {
        console.error("Error freezing user:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

import { Mentor} from "../models/mentorModel.js";
import bcrypt from 'bcrypt'; 
import { generateToken } from "../utils/token.js";


export const mentorSignup = async(req,res,next)=>{
    try {

        const {name,email,password,mobile,profilePic}=req.body;
        
        if(!name || !email || !password || !mobile){
            return res.status(400).json({message:"all fields required"});
        }
        
        const userExist =await Mentor.findOne({email:email});
        if (userExist){
            return res.status(400).json({message:"mentor alredy exist"});
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
       

        const newUser = new Mentor({name,email,password:hashedPassword,mobile,profilePic});
        await newUser.save();

        const token= generateToken(newUser,'mentor');

        res.cookie('token',token)

        res.status(201).json({ message: "mentor created successfully", user: newUser });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};
//     } catch (error) {
//         res.status(error,statusCode || 500).json({message:error.message || 'internal server error'});
//     }
// }

export const mentorLogin = async(req,res,next)=>{
    try {

        const {email,password}=req.body;
        
        if(!email || !password ){
            return res.status(400).json({message:"all fields required"});
        }
        
        const userExist =await Mentor.findOne({email:email});
        if (!userExist){
            return res.status(400).json({message:"mentor does not exist"});
        }

        const isPasswordMatch = bcrypt.compareSync(password,userExist.password);

        if(!isPasswordMatch){
            return res.status(400).json({message:"mentor not authenticated"})

        }


        const token= generateToken(userExist,'mentor');

        res.cookie('token',token);

        
        res.status(201).json({ message: "mentor login successfull"});
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};



export const mentorProfile= async(req,res,next)=>{
    try {

        const userId = req.user.id;
        const userProfile = await Mentor.findById(userId).select("==password");

        res.status(201).json({ message: "mentor login successfull",data:userProfile});
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};


export const mentorLogout= async(req,res)=>{
    try {
        res.clearCookie('token');
        res.status(201).json({ message: "mentor loged out "});
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

export const mentorResetPassword = async (req, res, next) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ message: "Email and new password are required" });
        }

        const mentor = await Mentor.findOne({ email });
        if (!mentor) {
            return res.status(404).json({ message: "mentor not found" });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        mentor.password = hashedPassword;
        await mentor.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};
export const mentorProfileUpdate = async (req, res, next) => {
    try {
        const mentorId = req.user.id;
        const { name, mobile, profilePic } = req.body;

        const updatedmentor = await Mentor.findByIdAndUpdate(
            mentorId,
            { name, mobile, profilePic },
            { new: true }
        );

        res.status(200).json({ message: "Profile updated successfully", data: updatedmentor });
    } catch (error) {
        console.error('Error during profile update:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};
export const mentorDeleteAccount = async (req, res, next) => {
    try {
        const mentorId = req.user.id;

        await Mentor.findByIdAndDelete(mentorId);
        res.clearCookie('token');
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error('Error during account deletion:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};
export const checkMentor = (req, res, next) => {
    try {
        if (req.user.role === 'mentor') {
            res.status(200).json({ message: "User is an mentor" });
        } else {
            res.status(403).json({ message: "Access denied" });
        }
    } catch (error) {
        console.error('Error checking mentor status:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};
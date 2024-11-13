import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
    {
        name: {
            type:String,
            required:true,
        },
        email:{
            type:String,
            unique:true,
            required:true,
        },
        mobile:{
            type:String,
            required:true,
            minLength:10,
            maxLength:10,
        },
        password:{
            type:String,
            required:true,
            minLength:6,
        },
        profilePic:{
            type:String,
            default:'',
        },
        isActive:{
            type:Boolean,
            default:true
        }
    },
    {timestamps: true}

);

  export const User = mongoose.model('User',userSchema);
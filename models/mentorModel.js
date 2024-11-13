import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required:true,
        },
        email:{
            type: String,
            required:true,
            unique:true,
        },
        role:{
            type:String,
            enum:['mentor','admin'],
            default:'mentor'
        },
        password:{
            type:String,
            required:true,
        },
        courses:[{type:mongoose.Types.ObjectId,ref:"Course"}],
    },
    {timestamps: true}
);
export const Mentor = mongoose.model("Mentor",mentorSchema);
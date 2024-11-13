import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required:true,
            minLength:3,
            maxLength:30 ,
            unique:true,
        },
        description:{
            type: String,
            required:true,
            minLength:3,
            maxLength:100,
        },
        price:{
            type:String,
            required:true,
        },
        duration:{
            type:String,
            required:true,
        },
        image:{
            type:String,
            default:"",
        },
        instructor:[{type:mongoose.Types.ObjectId,ref:"Mentor"}],
    },
    {timestamps: true}
);
export const Course = mongoose.model("Course", courseSchema);
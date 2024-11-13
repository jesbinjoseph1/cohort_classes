import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
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
            enum:['admin','mentor'],
        },
        password:{
            type:String,
            required:true,
        },
        courses:[{type:mongoose.Types.ObjectId,ref:"Course"}],
    },
    {timestamps: true}
);
export const Admin = mongoose.model("Admin",adminSchema);
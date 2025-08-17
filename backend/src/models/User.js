import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    role:{type:String,enum:["creator","editor"],required:true},
    ytChannel:{type:String},
    techStack:{type:String}
}, {timestamps:true});

export default mongoose.model("User",userSchema);
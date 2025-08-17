import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import generateToken from '../../utils/generateToken.js';

export const registerUser=async(req,res)=>{
    try {
        const {name,email,password,role,ytChannel,techStack}=req.body

        if (!name || !email || !password || !role) {
            return res.status(400).json({message:"Missing required fields"})
        }
        //does user exist?
        const userExist=await User.findOne({email});
        if (userExist){
            return res.status(400).json({message:"Email already registed with us"});
        }
        //hash password
        const hashedPassword= await bcrypt.hash(password,10);

        //create user
        const user=await User.create({
            name,
            email,
            password:hashedPassword,
            role,
            ytChannel,
            techStack,
        });

        return res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            token:generateToken(user._id),
        })
    } catch (error){
        res.status(500).json({message:error.message});
    }
};
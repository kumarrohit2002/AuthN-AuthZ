const bcrypt=require('bcrypt')

const User=require('../models/User')
const jwt=require('jsonwebtoken');

require('dotenv').config();


//signUp handler
exports.signup=async (req,res)=>{
    try{
        // get data
        const {name,email,password,role}=req.body;
        
        //check if user already exists
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            });
        }

        //secure password
        let hashPassword;
        try{
            hashPassword=await bcrypt.hash(password,10);
        }catch(error){
            return res.status(500).json({
                success:false,
                message:"Error in hashing password"
            });
        }

        //create new user
        const user = await User.create({
            name,email,password:hashPassword,role
        })

        return res.status(200).json({
            success:true,
            data:user,
            message:"User SignUp Successfully!!"
        })

    }catch(error){
        console.log("Error in SignUp");
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"User cann't signUp successfully!!"
        })
    }
}


exports.login= async(req,res)=>{
    try{
        //fetch data
        const {email,password} = req.body;

        //validation on email and password
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"please fill all the detsils carefully"
            })
        }

        //checked for registered user
        let user=await   User.findOne({email});

        //if not a registered user
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered"
            })
        }

        const payload={
            email:user.email,
            id:user._id,
            role:user.role
        }

        //verify password & generate a Jwt token
        if(await bcrypt.compare(password,user.password)){
            // password match
            let token =jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",});
            // convert in obj formate
            user=user.toObject();
            user.token=token;
            user.password=undefined;
            const opations={
                expires:new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true
            }
            res.cookie("token",token,opations).status(200).json({
                success:true,
                token,
                user,
                message:"User Logged in Successfully"
            })

        }else{
            // password do not match
            return res.status(402).json({
                success:false,
                message:"password in correct"
            })
        }


    }catch(error){
        console.log("Error in login handler");
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error in login handler"
        })
    }
}
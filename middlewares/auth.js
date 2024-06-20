// auth, isStudent, isAdmin
const jwt=require('jsonwebtoken');

require('dotenv').config();

exports.auth=(req,res,next)=>{
    try{
        //extact jwt token
        //pending -> other way to find token
        const token=req.body.token;

        if(!token){
            return res.status(402).json({
                success: false,
                message: 'token is missing'
            })
        }

        //verify the token
        try{
            const decode=jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user=decode;
        
        }catch(err){
            console.log(err);
            return res.status(402).json({
                success: false,
                message: 'token is invalid, token verifying error'
            })
        }
        next();

    }catch(error){
        console.log(error);
        return res.status(401).json({
            success:false,
            message:"Error in auth middleware"
        })
    }
}

exports.isStudent=(req,res,next)=>{
    try{
        if(req.user.role !== "Student"){
            return res.status(401).json({
                success:false,
                message:'this is for protected route for student'
            });
        }

        next();

    }catch(error){
        return res.status(500).json({
            success:false,
            message:'User role not matching'
        })
    }
}

exports.isAdmin=(req,res,next)=>{
    try{
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success:false,
                message:'this is for protected route for Admin'
            });
        }

        next();

    }catch(error){
        return res.status(500).json({
            success:false,
            message:'User role not matching in admin middleware'
        })
    }
}






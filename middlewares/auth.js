const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//auth
exports.auth = async (req, res, next) => {
    try{
        console.log("Hii")
        //extract token
        const token =  req.header("Authorization").replace("Bearer ", "");
        // console.log("Token: ",token);
        // req.cookies.token 
                        // || req.body.token 
                        // || 

        //if token missing, then return response
        if(!token) {
            return res.status(401).json({
                success:false,
                message:'TOken is missing',
            });
        }

        //verify the token
        try{
            console.log("Trying to verify the token")
            const decode =  jwt.verify(token, "Im12@johnkhore");
            console.log("verfied successfully!")
            
            console.log(decode);
            req.user = decode;
        }
        catch(err) {
            //verification - issue
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            });
        }
        next();
    }
    catch(error) {  
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token',
        });
    }
}

//isStudent
exports.isCustomer = async (req, res, next) => {
 try{
        if(req.user.role !== "customer") {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Customer only',
            });
        }
        next();
 }
 catch(error) {
    return res.status(500).json({
        success:false,
        message:'User role cannot be verified, please try again'
    })
 }
}


//isInstructor
exports.isDeliveryBoy = async (req, res, next) => {
    try{
           if(req.user.role !== "delivery") {
               return res.status(401).json({
                   success:false,
                   message:'This is a protected route for deliveryBoy only',
               });
           }
           next();
    }
    catch(error) {
       return res.status(500).json({
           success:false,
           message:'User role cannot be verified, please try again'
       })
    }
   }


//isAdmin
exports.isAdmin = async (req, res, next) => {
    try{    
        //    console.log("Printing AccountType ", req.user.role);
           if(req.user.role !== "admin") {
               return res.status(401).json({
                   success:false,
                   message:'This is a protected route for Admin only',
               });
           }
           next();
    }
    catch(error) {
       return res.status(500).json({
           success:false,
           message:'User role cannot be verified, please try again'
       })
    }
}
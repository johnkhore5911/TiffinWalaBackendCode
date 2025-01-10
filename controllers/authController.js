const bcrypt = require("bcrypt");
// const bcrpyt = require("bcryptjs");

const User = require("../models/User");
// const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");
// const otpGenerator = require("otp-generator");
// const mailSender = require("../utils/mailSender");
// const { passwordUpdated } = require("../mail/templates/passwordUpdate");
// const Profile = require("../models/Profile");
require("dotenv").config();

const Credit = require("../models/Credit");


// exports.signup = async (req, res) => {
//     console.log("SignUp: ");
//     try {
//         // Destructure fields from the request body
//         const {
//             firstName,
//             lastName,
//             email,
//             password,
//             confirmPassword,
//             role, // Role to identify if the user is admin or not
//             contact,
//             address,
//             mealPreferences,
//             otp,
//             secretkey
//         } = req.body;

//         // Validate required fields
//         if (!email || !password || !confirmPassword || !role) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Email, password, confirm password, and role are required.",
//             });
//         }

//         // Check if password and confirm password match
//         if (password !== confirmPassword) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Password and Confirm Password do not match. Please try again.",
//             });
//         }

//         // Check if user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User already exists. Please sign in to continue.",
//             });
//         }

//         // If role is not admin, additional checks are needed
//         if (role !== "admin") {
//             // if (!firstName || !lastName || !otp) {
//             //     return res.status(403).json({
//             //         success: false,
//             //         message: "All fields are required for non-admin users.",
//             //     });
//             // }
//         }
//         if(role == "admin" && secretkey != process.env.adminSecretKey){
//             return res.status(403).json({
//                 success: false,
//                 message: "Wrong Secret Key",
//             });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create the user object
//         const userData = {
//             email,
//             password: hashedPassword,
//             role,
//             name: `${firstName || ""} ${lastName || ""}`.trim(),
//         };

//         // Add optional fields for non-admin users
//         if (role !== "admin") {
//             userData.contact = contact || null;
//             userData.address = address || null;
//             userData.mealPreferences = mealPreferences || null;
//         }


        

//         // Save the user to the database
//         const user = await User.create(userData);

//         return res.status(200).json({
//             success: true,
//             user,
//             message: "User registered successfully.",
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: "User cannot be registered. Please try again.",
//         });
//     }
// };


// Login controller for authenticating users

exports.signup = async (req, res) => {
    console.log("SignUp: ");
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            role,
            contact,
            address,
            mealPreferences,
            secretkey,
            fcmToken
        } = req.body;

        if (!email || !password || !confirmPassword || !role) {
            return res.status(403).json({
                success: false,
                message: "Email, password, confirm password, and role are required.",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match. Please try again.",
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in to continue.",
            });
        }

        if (role === "admin" && secretkey !== "123") {
            return res.status(403).json({
                success: false,
                message: "Wrong Secret Key",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = {
            email,
            password: hashedPassword,
            role,
            name: `${firstName || ""} ${lastName || ""}`.trim(),
            address,
            fcmToken
        };

        if (role !== "admin") {
            userData.contact = contact || null;
            userData.address = address || null;
            userData.mealPreferences = mealPreferences || null;
        }

        const user = await User.create(userData);

        // Initialize credit for the user
        const creditData = {
            user: user._id, // Reference the created user's ID
            mealPlan: null, // No meal plan initially
            availableCredits: 0, // Initialize credits to zero
        };
        await Credit.create(creditData);

        return res.status(200).json({
            success: true,
            user,
            message: "User registered successfully and credits initialized.",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again.",
        });
    }
};

exports.login = async (req, res) => {
	try {
		// Get email and password from request body
		const { email, password,fcmtoken } = req.body;

		// Check if email or password is missing
		if (!email || !password) {
			// Return 400 Bad Request status code with error message
			return res.status(400).json({
				success: false,
				message: `Please Fill up All the Required Fields`,
			});
		}

		// Find user with provided email
		let user = await User.findOne({ email })

        
        
		// If user not found with provided email
		if (!user) {
            // Return 401 Unauthorized status code with error message
			return res.status(401).json({
                success: false,
				message: `User is not Registered with Us Please SignUp to Continue`,
			});
		}
        user.fcmToken=fcmtoken;
        user.save();

        const payload = {
            email: user.email,
            id: user._id,
            role: user.role,
            // hostelNumber:user.hostelNumber
          };
        
          if (await bcrypt.compare(password, user.password)) {
            //password match
            //login and give JWT token
            //create JWT token
            let token = jwt.sign(payload, 'Im12@johnkhore', {
              expiresIn: "24h",
            });
            
            
      
          user = user.toObject();
          user.token = token;
          console.log(user);
          user.password = undefined;
          console.log(user);
          console.log("token:",token);
          
      
          const options ={
            expires: new Date( Date.now() + 3 * 24 * 60 * 60 * 1000),
            //not access on client side
            // httpOnly:true,
              sameSite: "None",

          }
          res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user,
            message:"User Logged in successfully"
          })
        }
        else {
            //password does not match
            return res.status(403).json({
              success: false,
              message: "Please enter correct Password",
            });
	    }
    } catch (error) {
		console.error(error);
		// Return 500 Internal Server Error status code with error message
		return res.status(500).json({
			success: false,
			message: `Login Failure Please Try Again`,
		});
	}
}

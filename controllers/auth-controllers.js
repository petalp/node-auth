const User = require("../models/User")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


       
// register controller
const registerUser = async (req, res)=>{
    try{
        // register controller
        const { username, email, password, role } = req.body;

        // check if the user is already exists in our database
        const checkExistingUser = await User.findOne({$or:[{username, email}]})
        if(checkExistingUser){
            res.status(404).json({
                success:false,
                message:"User already exits"
            }); return;  
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // create  a new user and save in your database
        const newlyCreatedUser = new User({
            username,
            email,
            password:hashPassword,
            role:role || "user"
        })

        await newlyCreatedUser.save();

        if(newlyCreatedUser){
            res.status(200).json({
                success:true,
                message:"User has registered successfully", 
                data: newlyCreatedUser
            })
        }else{
             res.status(200).json({
                success:false,
                message:"User has not been registered "})
        }
    }catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:"Some error occured! Please try again"
        });
    }
}


// create login user
const loginUser = async (req, res)=>{
    try{
        const {username, password} = req.body;

        //find if the current user is exists in database or not
        const user = await User.findOne({username});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"user not found"
            })  
        }
        
        //check if the password is correct 
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({
                success:false,
                message:"user not found"
            }) 
        }

         // create json web token
         const token = jwt.sign({
            userId:user._id,
            username:user.username,
            role:user.role
         }, process.env.JWT_SECRET_KEY, {expiresIn:"15m"})

         res.status(201).json({
            success:true,
            message:"user login successfully",
            token:token
         })
    }catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:"Some error occured! Please try again"
        }); 
    }
}


const changePassword = async(req, res) => {
    try{
        //extract userId from the request object
        const userId = req.userInfo.userId;
 
        //extracted old and new password
        const {oldPassword, newPassword} = req.body;

        //find the current logged in user
        const user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            });
        }

        //check if the old password is correct
        const isPasswordCorrect = await bcrypt.compare(oldPassword,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({
                success:false,
                message:"Old password is incorrect"
            });
        }
        
        //hash the new password here
        const salt = await bcrypt.genSalt(10);
        const hashNewPassword = await bcrypt.hash(newPassword, salt);

        //update the new password in the database
        user.password = hashNewPassword;
        await user.save();
        res.status(200).json({
            success:true,
            message:"Password changed successfully"
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Something went wrong"
        })
    }
}

module.exports = {registerUser, loginUser, changePassword};
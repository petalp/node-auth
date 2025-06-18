const express = require('express');
const authMiddleware = require('../middleware/auth-middleware')


const router = express.Router()

router.get('/home',authMiddleware, (req, res)=>{
    const {username, userId, role} = req.userInfo
    res.status(201).json({
        message:"Welcome to the home page",
        user:{
            _id:userId,
            username,
            role
        }
    })
    
})


module.exports = router;
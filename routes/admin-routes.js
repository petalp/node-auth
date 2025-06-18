const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const isAdminUser = require('../middleware/admin-middleware');

const router  = express.Router();

router.get("/admin", authMiddleware, isAdminUser, (req, res)=>{
    const {username, userId, role} = req.userInfo
    return res.json({
        message:"Welcome to the admin page", 
        user:{
            _id:userId,
            username,
            role
        }
    })
})

module.exports = router;
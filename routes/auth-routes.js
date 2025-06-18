const express = require('express');
const { registerUser, loginUser, changePassword } = require('../controllers/auth-controllers');
const authMiddleware = require('../middleware/auth-middleware');


const router = express.Router();

//register user
router.post('/register', registerUser);

//user login
router.post("/login", loginUser);

// update user password
router.put('/update-password', authMiddleware, changePassword )


module.exports = router;
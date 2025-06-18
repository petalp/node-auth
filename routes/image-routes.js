const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');
const upladMiddleware = require('../middleware/upload-middleware');
const { uploadImage,fetchImagesController, deleteImageController } = require('../controllers/image-controller');



const router = express.Router();


//uplad image 
router.post('/upload', 
            authMiddleware, 
            adminMiddleware, 
            upladMiddleware.single('image'), 
            uploadImage);

// get all images
router.get('/fetch',authMiddleware, fetchImagesController);

// delete image
router.delete('/delete/:id', authMiddleware, adminMiddleware, deleteImageController)

module.exports = router;
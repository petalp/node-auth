
const Image = require("../models/image");
const { uploadToImage  } = require("../helper/cloudinaryHelper");
const cloudinary = require('../config/cloudinary')



const uploadImage = async(req, res)=>{
    try{
        
        if(!req.file){
            return res.status(400).json({
                success:false,
                message:'File is required. Please upload'
            })
        }
        // upload to cloudinary
        const {url, publicId} = await uploadToImage (req.file.path);

        //store the image url and public id along width the uploaded use id in database
        const newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedBy:req.userInfo.userId
        })

        await newlyUploadedImage.save()

        res.status(201).json({
            success:true,
            message:"Image uploaded successfully",
            image:newlyUploadedImage
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Something went wrong"
        })
    }
}

const fetchImagesController = async(req, res)=>{
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages / limit);

        const sortObj = {};
        sortObj[sortBy] = sortOrder;
        const images = await Image.find({}).sort(sortObj).skip(skip).limit(limit);
        if(images){
            res.status(200).json({
                success:true,
                message:"Images fetched successfully",
                images:images,
                totalPages:totalPages,
                currentPage:page,
                totalImages:totalImages
            });
        }
     }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Something went wrong"
        })
    }
}

const deleteImageController = async(req, res)=>{
    try{
        const getCurrentId = req.params.id;
        const userId = req.userInfo.userId;

        const image = await Image.findById(getCurrentId);
        if(!image){
            return res.status(404).json({
                success:false,
                message:"Image not found"
            });    
        }

        // check if the image belongs to the user
        if(image.uploadedBy.toString() !== userId){
            return res.status(403).json({
                success:false,
                message:"You are not authorized to delete this image"
            });
        }

        await cloudinary.uploader.destroy(image.publicId);
        // delete the image from the database
        await Image.findByIdAndDelete(getCurrentId);
        
        res.status(200).json({
            success:true,
            message:"Image deleted successfully"
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Something went wrong"
        })
    }
}

module.exports = {
    uploadImage,
    fetchImagesController,
    deleteImageController
}
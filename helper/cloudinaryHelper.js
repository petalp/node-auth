const cloudinary = require("../config/cloudinary");

const uploadToImage = async (filePath) => {
    try{
        const result = await cloudinary.uploader.upload(filePath);

        return {
            url: result.secure_url,
            publicId: result.public_id,
        }
    }catch(error){
        console.error("Error while uploading image to Cloudinary:", error);
        throw error;
     }  
}

module.exports = { uploadToImage  };
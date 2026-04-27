const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const ApiError = require("../utils/ApiError");
require("dotenv").config({ path: "./.env" });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.API_SECRET,
});


function createImageManager() {
  let previousPublicId = null; // private variable via closure

  return async function handleNewUpload(localFilePath) {
    // upload new image
    const result = await cloudinary.uploader.upload(localFilePath, {
      
      resource_type: "auto",
    });

    // delete old image
    if (previousPublicId) {
      await cloudinary.uploader.destroy(previousPublicId);
    }

    // remember new public_id for next upload
    previousPublicId = result.public_id;

    return {
      imageUrl: result.secure_url,
    };
  };
}

const uploadUserImage = createImageManager();

module.exports = uploadUserImage;

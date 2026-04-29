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
  let previousPublicId = null; // closure variable

  return async function handleNewUpload(localFilePath) {
    try {
      if (!localFilePath) {
        throw new ApiError(400, "Image file path is required");
      }

      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
      });

      // Delete previous uploaded image
      if (previousPublicId) {
        await cloudinary.uploader.destroy(previousPublicId);
      }

      // Delete local file after successful upload
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }

      // Save current public_id for next replacement
      previousPublicId = result.public_id;

      return {
        imageUrl: result.secure_url,
      };
    } catch (error) {
      // Remove local file if upload failed
      if (localFilePath && fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }

      throw new ApiError(
        500,
        error.message || "Image upload failed"
      );
    }
  };
}

const uploadUserImage = createImageManager();

module.exports = uploadUserImage;
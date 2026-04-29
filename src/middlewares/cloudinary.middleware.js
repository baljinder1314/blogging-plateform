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
  return async function handleNewUpload(
    localFilePath,
    type = "post",
    oldImageUrl = null,
  ) {
    try {
      if (!localFilePath) {
        throw new ApiError(400, "Image file path is required");
      }

      // Upload new image
      const result = await cloudinary.uploader.upload(localFilePath, {
        folder: type === "profile" ? "users/profile" : "users/posts",
        resource_type: "auto",
      });

      // Delete previous image ONLY for profile update
      if (type === "profile" && oldImageUrl) {
        const publicId = getPublicIdFromUrl(oldImageUrl);

        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }

      // Remove local temp file
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }

      return {
        imageUrl: result.secure_url,
      };
    } catch (error) {
      if (localFilePath && fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }

      throw new ApiError(500, error.message || "Image upload failed");
    }
  };
}

// Extract public_id from Cloudinary URL
function getPublicIdFromUrl(url) {
  try {
    const parts = url.split("/");
    const fileName = parts.pop().split(".")[0]; // abc123
    const folder = parts.slice(parts.indexOf("upload") + 2).join("/");

    return folder + "/" + fileName;
  } catch {
    return null;
  }
}
const uploadUserImage = createImageManager();

module.exports = uploadUserImage;

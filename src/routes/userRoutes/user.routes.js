const { Router } = require("express");
const {
  register,
  login,
  logout,
  refreshToken,
  uploadImage,
} = require("../../controllers/userControllers/user.controllers.js");
const authUser = require("../../middlewares/authUser.middlewares.js");
const upload = require("../../middlewares/multer.middleware.js");

const router = Router();
// user routers
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(authUser, logout);
router.route("/refresh-token").post(refreshToken);
//upload Image
router.route("/upload").post(authUser,upload.single("image"), uploadImage);

//post routers

module.exports = router;

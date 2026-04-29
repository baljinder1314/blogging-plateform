const { Router } = require("express");
const {
  register,
  login,
  logout,
  refreshToken,
  uploadImage,
  me,
} = require("../../controllers/userControllers/user.controllers.js");
const authUser = require("../../middlewares/authUser.middlewares.js");
const upload = require("../../middlewares/multer.middleware.js");

const router = Router();
// user routers
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(authUser, logout);
router.route("/me").get(authUser,me)
router.route("/refresh-token").post(refreshToken);
//upload Image
router.route("/upload").post(authUser,upload.single("profileImage"), uploadImage);

//post routers

module.exports = router;

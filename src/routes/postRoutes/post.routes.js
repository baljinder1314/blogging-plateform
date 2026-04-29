const { Router } = require("express");
const {
  post,
  getAllPost,
  postInDetail,
  deletePost,
  updatePost,
} = require("../../controllers/postControllers/post.controllers");
const authUser = require("../../middlewares/authUser.middlewares");
const upload = require("../../middlewares/multer.middleware");
const postRouter = Router();

postRouter.route("/posts").post(authUser, upload.single("image"), post);
postRouter.route("/posts").get(getAllPost); // Allow public access to view all posts
postRouter.route("/posts/:id").get(postInDetail); // Allow public access to view post details
postRouter.route("/posts/:id").delete(authUser, deletePost);
postRouter.route("/posts/:id").put(authUser, updatePost);

module.exports = postRouter;

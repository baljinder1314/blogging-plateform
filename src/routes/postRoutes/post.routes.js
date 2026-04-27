const { Router } = require("express");
const {post, getAllPost, postInDetail, deletePost, updatePost} = require("../../controllers/postControllers/post.controllers");
const authUser = require("../../middlewares/authUser.middlewares");
const postRouter = Router();

postRouter.route("/posts").post(authUser, post);
postRouter.route("/posts").get(authUser,getAllPost)
postRouter.route("/posts/:id").get(authUser,postInDetail)
postRouter.route("/posts/:id").delete(authUser,deletePost)
postRouter.route("/posts/:id").put(authUser,updatePost)

module.exports = postRouter;

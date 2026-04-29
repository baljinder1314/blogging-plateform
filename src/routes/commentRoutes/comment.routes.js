const { Router } = require("express");
const {
  comment,
  deleteComment,
  getUserComments,
} = require("../../controllers/commentControllers/comment.controllers");
const authUser = require("../../middlewares/authUser.middlewares");
const commentRouter = Router();

commentRouter.route("/comment/:postId").post(authUser, comment);
commentRouter.route("/comment/:commentId").delete(authUser, deleteComment);
commentRouter.route("/my-comments").get(authUser, getUserComments); // Get user's comments

module.exports = commentRouter;

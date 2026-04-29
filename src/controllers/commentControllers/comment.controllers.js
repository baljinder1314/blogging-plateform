const asyncHandler = require("../../utils/asyncHandler");
const Post = require("../../models/post.models");
const Comment = require("../../models/commet.model");
const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../utils/ApiError");

const comment = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return next(new ApiError(400, "Comment text is required"));
  }

  const post = await Post.findById(postId);

  if (!post) {
    return next(new ApiError(404, "Post not found"));
  }
  const comment = await Comment.create({
    text,
    user: req.user._id,
    post: postId,
  });

  const populatedComment = await Comment.findById(comment._id)
    .populate("user", "fullName profileImage")
    .populate("post", "title");

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { comment: populatedComment },
        "Comment added successfully",
      ),
    );
});

const deleteComment = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return next(new ApiError(404, "Comment not found"));
  }

  if (comment.user.toString() !== req.user._id.toString()) {
    return next(
      new ApiError(403, "You are not allowed to delete this comment"),
    );
  }

  await Comment.findByIdAndDelete(commentId);

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

// Get user's comments (current user)
const getUserComments = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const userComments = await Comment.find({ user: userId })
    .populate("user", "fullName profileImage")
    .populate("post", "title")
    .sort({ createdAt: -1 });

  if (!userComments) {
    return next(new ApiError(404, "Comments not found"));
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { comments: userComments, count: userComments.length },
        "User comments fetched successfully",
      ),
    );
});

module.exports = {
  comment,
  deleteComment,
  getUserComments,
};

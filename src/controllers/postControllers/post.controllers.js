const addPostSchemaValidation = require("../../../userValidation/post.validation");
const Post = require("../../models/post.models");
const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../utils/ApiError");
//add post
const post = asyncHandler(async (req, res, next) => {
  const postData = addPostSchemaValidation.parse(req.body);

  const newPost = await Post.create({
    ...postData,
    author: req.user._id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, { post: newPost }, "Post added successfully"));
});

//get all post
const getAllPost = asyncHandler(async (req, res, next) => {
  const allPost = await Post.find({});

  if (!allPost) {
    return next(new ApiError(404, "Posts are not found"));
  }

  res.status(201).json(new ApiResponse(201, { post: allPost }, "All posts"));
});

//post in detail
const postInDetail = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const onePost = await Post.findById(id);

  if (!onePost) {
    return next(new ApiError(404, "post is not found"));
  }

  res
    .status(201)
    .json(new ApiResponse(201, { post: onePost }, "Post in Detail"));
});
//delete post
const deletePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deletePost = await Post.findByIdAndDelete(id, {
    returnDocument: "after",
  });

  if (!deletePost) {
    next(new ApiError(500, "post is not deleted"));
  }

  res.status(201).json(new ApiResponse(201, {}, "Delete Post"));
});
//update post
const updatePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const postData = addPostSchemaValidation.parse(req.body);

  const updatePostData = await Post.findByIdAndUpdate(id, postData, {
    returnDocument: "after",
  });

  if (!updatePostData) {
    return next(new ApiError(404, "post is not found"));
  }
  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { post: updatePostData },
        "post is updated successfuly",
      ),
    );
});

module.exports = { post, getAllPost, postInDetail, deletePost, updatePost };

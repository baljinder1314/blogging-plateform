const addPostSchemaValidation = require("../../../userValidation/post.validation");
const Post = require("../../models/post.models");
const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../utils/ApiError");
const uploadUserImage = require("../../middlewares/cloudinary.middleware");
const Comment = require("../../models/commet.model");
//add post
const post = asyncHandler(async (req, res, next) => {
  const postData = addPostSchemaValidation.parse(req.body);

  if (!postData) {
    return;
  }

  let imageUrl = "";

  if (req.file) {
    const uploadedImage = await uploadUserImage(req.file?.path,"post");
    imageUrl = uploadedImage?.imageUrl;
  }

  const newPost = await Post.create({
    ...postData,
    image: imageUrl,
    author: req.user._id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, { post: newPost }, "Post added successfully"));
});
//get all post
const getAllPost = asyncHandler(async (req, res, next) => {
  const allPost = await Post.find({}).populate(
    "author",
    "fullName profileImage",
  );

  if (!allPost) {
    return next(new ApiError(404, "Posts are not found"));
  }

  res.status(200).json(new ApiResponse(200, { post: allPost }, "All posts"));
});

//post in detail
const postInDetail = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const onePost = await Post.findById(id).populate(
    "author",
    "fullName profileImage",
  );

  const comments = await Comment.find({ post: id })
    .populate("user", "fullName profileImage")
    .sort({ createdAt: -1 });

  if (!onePost) {
    return next(new ApiError(404, "Post not found"));
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        post: onePost,
        comments,
      },
      "Post detail",
    ),
  );
});
//delete post
const deletePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deletePost = await Post.findByIdAndDelete(id, {
    returnDocument: "after",
  });

  if (!deletePost) {
    return next(new ApiError(500, "post is not deleted"));
  }

  res.status(200).json(new ApiResponse(200, {}, "Delete Post"));
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
    .status(200)
    .json(
      new ApiResponse(
        200,
        { post: updatePostData },
        "post is updated successfuly",
      ),
    );
});

module.exports = { post, getAllPost, postInDetail, deletePost, updatePost };

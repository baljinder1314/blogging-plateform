const jwt = require("jsonwebtoken");
const {
  userRegisterSchema,
  userLoginSchema,
} = require("../../../userValidation/user.validation");
const User = require("../../models/user.model");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const uploadUserImage = require("../../middlewares/cloudinary.middleware");
require("dotenv").config({ path: "./.env" });

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

const options = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
};
//Register
const register = asyncHandler(async (req, res, next) => {
  let validation = userRegisterSchema.parse(req.body);
  let exitingUser = await User.findOne({ email: validation.email });
  if (exitingUser) {
    return next(new ApiError(409, "User already exist"));
  }
  let user = await User(validation);
  await user.save();
  let { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user?._id,
  );
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );
  res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        { user: createdUser },
        "User registered successfully",
      ),
    );
});
//Login

const login = asyncHandler(async (req, res, next) => {
  const validateData = userLoginSchema.parse(req.body);

  const findUser = await User.findOne({ email: validateData.email });

  if (!findUser) {
    return next(new ApiError(402, "You are not Register on this Side"));
  }

  const isPasswordOk = await findUser.isPasswordCorrect(validateData.password);

  if (!isPasswordOk) {
    return next(new ApiError(402, "password is incorrect"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    findUser._id,
  );

  let loggInUser = await User.findById(findUser._id).select(
    "-password -refreshToken",
  );
  res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken)
    .json(new ApiResponse(201, { user: loggInUser }, "login successfuly"));
});
//logout
const logout = asyncHandler(async (req, res, next) => {
  let userId = req.user?._id;

  await User.findByIdAndUpdate(
    userId,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      returnDocument: "after",
    },
  );

  res
    .status(201)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(201, {}, "logout successfuly"));
});

//refreshToken
const refreshToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    throw new ApiError(403, "token is expired");
  }

  const verifyToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  const user = await User.findById(verifyToken?._id);

  if (user.refreshToken !== token) {
    throw new ApiError(400, "Invalid token");
  }
  let { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  const newUser = await User.findById(verifyToken._id).select(
    "-password -refreshToken",
  );

  res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {}, "Access token refreshed successfully"));
});

//upload Image
const uploadImage = asyncHandler(async (req, res, next) => {
  const image = req.file;
  const userId = req.user._id;

  if (!image) {
    throw new ApiError(404, "Image path is not found");
  }
  const uriOfImage = await uploadUserImage(image.path, "profile");

  if (!uriOfImage) {
    return next(new ApiError(500, "Image is not uploaded on cloudinary"));
  }

  const uploadImage = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        profileImage: uriOfImage.imageUrl,
      },
    },
    {
      returnDocument: "after",
    },
  ).select("-password -refreshToken");

  res
    .status(201)
    .json(new ApiResponse(201, { user: uploadImage }, "Image uploaded"));
});

const me = asyncHandler(async (req, res, next) => {
  let userId = req.user._id;

  const user = await User.findById(userId).select("-password -refreshToken");

  res.status(201).json(new ApiResponse(201, { user: user }, "done"));
});

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  uploadImage,
  me,
};

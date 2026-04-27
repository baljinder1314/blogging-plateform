const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError")
require("dotenv").config({ path: "./.env" });

async function authUser(req, res, next) {
  try {
    const token = req.cookies;
    

    
    if (!token) {
      throw new ApiError(402, "token is not found");
    }

    let decoded = jwt.verify(
      token.accessToken,
      process.env.ACCESS_TOKEN_SECRET,
    );

    if (!decoded) {
      throw new ApiError(402, "Invalid token");
    }

    let user = await User.findById(decoded._id);
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Token expired"));
    }
    if (error.name === "JsonWebTokenError") {
      return next(new ApiError(401, "Invalid token"));
    }
    next(error);
  }
}

module.exports = authUser;

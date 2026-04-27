const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");
require("dotenv").config();

async function connectDB() {
  try {
    const connetionString = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB is connected: ${connetionString.connection.host}`);
  } catch (error) {
    throw new ApiError(500, "MongoDB is not Connected");
  }
}

module.exports = connectDB;

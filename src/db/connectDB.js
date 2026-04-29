const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");
const { APP_NAME } = require("../../constent");
require("dotenv").config();
const  dns = require("node:dns/promises"); 


dns.setServers(["1.1.1.1", "1.0.0.1"]);
async function connectDB() {
  try {
    const connectionString = await mongoose.connect(`${process.env.MONGO_URI}/${APP_NAME}`);

    console.log(`MongoDB is connected: ${connectionString.connection.host}`);
    return connectionString;
  } catch (error) {
    console.log("MongoDB Connection Error:", error);
    throw error;
  }
}

module.exports = connectDB;

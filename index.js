const app = require("./app");
const connectDB = require("./src/db/connectDB");
const ApiError = require("./src/utils/ApiError");
require("dotenv").config({path:"./.env"});

let port = process.env.PORT || 8080;
connectDB()
  .then((res) => {
    app.listen(port, () => {
      console.log(`server start at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    throw new ApiError(500, "mongodb is not connected");
  });

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const ApiError = require("./src/utils/ApiError");
const path = require("path");
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/public")));

// User Routers import
const userRouters = require("./src/routes/userRoutes/user.routes.js");
const postRouter = require("./src/routes/postRoutes/post.routes.js");
//Router declaration
app.use("/api/auth", userRouters);
//post Declaration
app.use("/api/auth", postRouter);

app.all(/.*/, (req, res, next) => {
  return next(new ApiError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).send(message);
});

module.exports = app;

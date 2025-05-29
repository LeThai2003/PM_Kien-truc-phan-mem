const express = require("express");
require("dotenv").config();
const cors = require("cors");
const database = require("./database/index");
const {errorHandler} = require("./middlewares/error.middleware");
const authRoute = require("./routes/auth.route");
const projectRoute = require("./routes/project.route");
const taskRoute = require("./routes/task.route");
const uploadRoute = require("./routes/upload.route");
const commentRoute = require("./routes/comment.route");
const userRoute = require("./routes/user.route");
const searchRoute = require("./routes/search.route");
const notificationRoute = require("./routes/notification.route");


// ----connect database----
database;
// ----end connect database----

// ----config app-----
const app = express();

app.use(express.json());
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true                
}));
// ----end config app-----

// -----route-----
app.use("/auth", authRoute);
app.use("/project", projectRoute);
app.use("/task", taskRoute);
app.use("/upload", uploadRoute);
app.use("/comment", commentRoute);
app.use("/user", userRoute);
app.use("/search", searchRoute);
app.use("/notification", notificationRoute);
// ----end route----

app.use(errorHandler);

module.exports = app;
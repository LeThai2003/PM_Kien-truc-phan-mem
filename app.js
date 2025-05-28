const express = require("express");
require("dotenv").config();
const database = require("./database/index");
const {errorHandler} = require("./middlewares/error.middleware");
const authRoute = require("./routes/auth.route");
const projectRoute = require("./routes/project.route");
const taskRoute = require("./routes/task.route");
const uploadRoute = require("./routes/upload.route");


// ----connect database----
database;
// ----end connect database----

// ----config app-----
const app = express();

app.use(express.json());
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
// ----end config app-----

// -----route-----
app.use("/auth", authRoute);
app.use("/project", projectRoute);
app.use("/task", taskRoute);
app.use("/upload", uploadRoute);
// ----end route----

app.use(errorHandler);

module.exports = app;
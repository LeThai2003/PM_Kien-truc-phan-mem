const express = require("express");
require("dotenv").config();
const database = require("./database/index");
const {errorHandler} = require("./middlewares/error.middleware");
const authRoute = require("./routes/auth.route");
const projectRoute = require("./routes/project.route");


// ----connect database----
database;
// ----end connect database----

// ----config app-----
const app = express();

app.use(express.json());
// ----end config app-----

// -----route-----
app.use("/auth", authRoute);
app.use("/project", projectRoute);
// ----end route----

app.use(errorHandler);

module.exports = app;
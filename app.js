const express = require("express");
require("dotenv").config();
const database = require("./database/index");
const {errorHandler} = require("./middlewares/error.middleware");
const authRoute = require("./routes/auth.route");


// ----connect database----
database;
// ----end connect database----

// ----config app-----
const app = express();

app.use(express.json());
// ----end config app-----

// -----route-----
app.use("/auth", authRoute);
// ----end route----

app.use(errorHandler);

module.exports = app;
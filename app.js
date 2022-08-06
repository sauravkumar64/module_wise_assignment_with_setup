//var createError = require("http-errors");
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require('./config/documentation/swagger.json');
const cors = require("cors");
//var logger = require('morgan');

const indexRouter = require("./routes/index");
const versionRoutes = require("./routes/versionRoutes");

const app = express();

//app.use(logger());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(cors());

//Sequelize connection
require("./dbConnection").connectDB();
require("./models");

//routes
app.use("/", indexRouter);
app.use("/app", versionRoutes);

//catch 404 and forward to error handler
app.use(function (req, res, next) {
  next();
});

// error handler
app.use(function (err, req, res) {
  
// set locals, only providing error in development
res.locals.message = err.message;
res.locals.error = req.app.get("env") === "development" ? err : {};

// render the error page
res.status(err.status || 500);
res.render("error");
});

module.exports = app;

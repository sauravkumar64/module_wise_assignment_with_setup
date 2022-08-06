require("dotenv").config();
const express = require("express");
var cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

const port = 4001;
const swaggerUI = require("swagger-ui-express");
const swaggerJsDocs = require("./swagger.json");

app.use("/swagger-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));
//use for use the req.body for take a data from frontend
app.use(bodyParser.json());
//data comes from frontend in the form of form in url
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
require("./config/connectionDB").connect();
require("./config/connectionDB").syn();
const router = require("./routes/AdminRoutes");
//Due to this table is create at database but not use it not table create
require("./model");
app.get("/", (req, res) => {
  res.send("<h1>Home page</h1>"); 
});

app.use("/admin", router);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

require("dotenv").config();
const express = require("express");
var cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

const port = 8000;
const swaggerUI = require("swagger-ui-express");
const swaggerJsDocs = require("./swagger.json");

app.use("/swagger-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
require("./config/connectionDB").connect();
require("./config/connectionDB").syn();

const feedback = require("./routes/feedbackRoutes");
//Due to this table is create at database but not use it not table create
require("./model/index.js");
app.get("/", (req, res) => {
  res.send("<h1>Home page</h1>");
});

app.use("/feedback", feedback);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

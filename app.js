//require("dotenv").config()
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 4001;
var cookieParser = require('cookie-parser');

const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require('./config/documentation/swagger.json');
const cors = require("cors");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(cors());

require("./connectionDB").connect();
require("./connectionDB").syn();

const router = require("./routes/userRoutes");
//Due to this table is create at database not use it not table create
require("./model");
app.get("/", (req, res) => {
  res.send("<h1>Home page</h1>");
});



app.use("/user", router);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

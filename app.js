if (process.env.NODE_ENV === 'development') {
  require("dotenv").config();
}
const cors = require("cors");
const express = require("express");
const errorHandler = require("./helpers/errors");
const app = express();
const routes = require("./routes");


// console.log(process.env.NODE_ENV)
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use("/", routes);

app.use(errorHandler)

module.exports = app
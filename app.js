if (process.env.NODE_ENV === 'development') {
  require("dotenv").config();
}
const cors = require("cors");
const express = require("express");
const errorHandler = require("./helpers/errors");
const app = express();
const routes = require("./routes");
const PORT = process.env.PORT || 3000;

console.log(process.env.NODE_ENV)
app.use(cors({
  origin: 'http://localhost:5500',
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use("/", routes);

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Listening to PORT ${PORT}`);
});

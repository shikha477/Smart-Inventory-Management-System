const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const routes = require("./routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();

const { checkLowStock } = require("./services/alertEngine.service");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api", routes);

app.use(errorHandler);

setInterval(async () => {
  try {
    await checkLowStock();
  } catch (error) {
    console.error("Alert engine error:", error);
  }
}, 60000);

module.exports = app;
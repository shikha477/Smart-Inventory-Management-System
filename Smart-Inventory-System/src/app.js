const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const routes = require("./routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();

/*
    Global Middleware
*/

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/*
    Routes
*/

app.use("/api", routes);

/*
    Error Handler
*/

app.use(errorHandler);

module.exports = app;
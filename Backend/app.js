const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

app.use(cors());

const { execPath } = require("process");

const userRouter = require("./Routes/userRoutes.js");
const propertyRouter = require("./Routes/propertyRoutes.js");

const morgan = require("morgan");
app.use(morgan("dev"));

app.use(express.json());

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	console.log(req.headers);
	next();
});

app.get("/", (req, res, next) => {
	console.log(req);
	res.send("Success");
});

app.use("/api/users", userRouter);
app.use("/api/properties", propertyRouter);

// app.use(express.static(`${__dirname}/public`));

module.exports = app;

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

mongoose
	.connect("mongodb://127.0.0.1:27017/Face2Face")
	.then((con) => {
		console.log("Database connection successful (server.js line 7)");
	})
	.catch((err) => console.error(err));

const app = require("./app");
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
	console.log(`App running on port ${port} (server.js line 21)`);
});

process.on("unhandledRejection", (err) => {
	console.log(err.name, ":", err.message);
	server.close(() => {
		process.exit(1);
	});
});

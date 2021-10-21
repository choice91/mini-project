const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
require("./db");

const authRouter = require("./routes/authRouter");

const app = express();
const logger = morgan("dev");

app.set("port", process.env.PORT || 4000);

app.use(logger);
app.use(express.json());

app.use("/auth", authRouter);

app.use((error, req, res, next) => {
  console.log(error);
  const errorStatus = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  return res.status(errorStatus).json({ message, data });
});

app.listen(app.get("port"), () => {
  console.log(`✅ Server listening on http://localhost:${app.get("port")}`);
});

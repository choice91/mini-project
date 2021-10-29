const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();
require("./db");

const swaggerFile = require("./swagger_output");

const authRouter = require("./routes/authRouter");
const checkInOutRouter = require("./routes/checkInOutRouter");
const userRouter = require("./routes/userRouter");

const app = express();
const logger = morgan("dev");
app.use(cors());

app.set("port", process.env.PORT || 4000);

app.use(logger);
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/auth", authRouter);
app.use("/attandance", checkInOutRouter);
app.use("/user", userRouter);

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

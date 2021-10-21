const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
require("./db");

const app = express();
const logger = morgan("dev");

app.use(logger);

app.set("port", process.env.PORT || 4000);

app.listen(app.get("port"), () => {
  console.log(`✅ Server listening on http://localhost:${app.get("port")}`);
});

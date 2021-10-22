const mongoose = require("mongoose");

let url;
if (process.env.NODE_ENV === "production") {
  url = process.env.DB_URL;
} else if (process.env.NODE_ENV === "development") {
  url = process.env.TEST_DB_URL;
}

mongoose.connect(url);

const db = mongoose.connection;

db.on("error", (error) => console.log("❗ DB Error", error));
db.once("open", () => console.log("✅ Connected to DB!"));

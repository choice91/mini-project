const mongoose = require("mongoose");
const moment = require("moment");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  memberSince: {
    type: String,
    required: true,
    default: moment().format("YYYY-MM-DD HH:mm:ss"),
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

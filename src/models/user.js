const mongoose = require("mongoose");

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
    default: new Date(
      Date.now() - new Date().getTimezoneOffset() * 60000
    ).toISOString(),
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

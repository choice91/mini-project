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
  },
  memberSince: {
    type: String,
    required: true,
  },
  socialOnly: {
    type: Boolean,
    default: false,
  },
  socialId: {
    type: String,
    default: null,
  },
  provider: {
    type: String,
    required: true,
    default: "local",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

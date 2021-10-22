const mongoose = require("mongoose");

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1;
const date = now.getDate();
const signupDate = `${year}-${month >= 10 ? month : "0" + month}-${
  date >= 10 ? date : "0" + date
}`;

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
    default: signupDate,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

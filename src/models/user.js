const mongoose = require("mongoose");

const [date, datetime] = new Date(Date.now() + 1000 * 60 * 60 * 9)
  .toISOString()
  .split("T");

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
    default: `${date} ${datetime.split(".")[0]}`,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

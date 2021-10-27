const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  attDate: {
    type: String,
    required: true,
  },
  attDatetime: {
    type: String,
    required: true,
  },
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
  },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;

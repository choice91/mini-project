const mongoose = require("mongoose");

const [date, datetime] = new Date(Date.now() + 1000 * 60 * 60 * 9)
  .toISOString()
  .split("T");

const attendanceSchema = new mongoose.Schema({
  attDate: {
    type: String,
    required: true,
    default: date,
  },
  attDatetime: {
    type: String,
    required: true,
    default: datetime.split(".")[0],
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

const Attendance = require("../models/attendance");

exports.checkIn = async (req, res, next) => {
  const { userId } = req;
  try {
    const [date, datetime] = new Date(Date.now() + 1000 * 60 * 60 * 9)
      .toISOString()
      .split("T");
    const info = await Attendance.findOne({ memberId: userId, attDate: date });
    if (info) {
      return res.status(200).json({ message: "이미 체크인 되었습니다." });
    }
    await Attendance.create({
      memberId: userId,
    });
    return res.status(201).json({ message: "정상적으로 체크인 되었습니다." });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
  return res.end();
};

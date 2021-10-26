const Attendance = require("../models/attendance");
const { validationResult } = require("express-validator");

const getDate = () => {
  const [date, datetime] = new Date(Date.now() + 1000 * 60 * 60 * 9)
    .toISOString()
    .split("T");
  const time = datetime.split(".")[0];
  return { date, time };
};

exports.checkIn = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation error");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const {
    userId,
    body: { message },
  } = req;
  const { date, time } = getDate();
  try {
    const info = await Attendance.findOne({ memberId: userId, attDate: date });
    console.log("info ::", info);
    console.log("date time ::", date, time);
    if (info) {
      return res.status(200).json({ message: "이미 체크인 되었습니다." });
    }
    const checkInInfo = await Attendance.create({
      memberId: userId,
      attDatetime: time,
      message: message || "😊",
    });
    return res
      .status(201)
      .json({ message: "정상적으로 체크인 되었습니다.", info: checkInInfo });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getAttInfo = async (req, res, next) => {
  try {
    // Attendance 모델의 모든 정보 검색
    const attInfo = await Attendance.find({})
      .sort({ attDate: "desc" })
      .populate("memberId");
    // 날짜별로 result배열에 저장
    const result = [];
    let object = {
      date: attInfo[0].attDate,
      users: [
        {
          _id: attInfo[0]._id,
          time: attInfo[0].attDatetime,
          name: attInfo[0].memberId.name,
          message: attInfo[0].message,
        },
      ],
    };
    result.push(object);
    for (let i = 1; i < attInfo.length; i++) {
      if (attInfo[i].attDate === result[result.length - 1].date) {
        result[result.length - 1].users.push({
          _id: attInfo[i]._id,
          time: attInfo[i].attDatetime,
          name: attInfo[i].memberId.name,
          message: attInfo[i].message,
        });
      } else {
        object = {
          date: attInfo[i].attDate,
          users: [
            {
              _id: attInfo[i]._id,
              time: attInfo[i].attDatetime,
              name: attInfo[i].memberId.name,
              message: attInfo[i].message,
            },
          ],
        };
        result.push(object);
      }
    }
    return res.status(200).json({ ok: true, info: result });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.isCheckIn = async (req, res, next) => {
  const { userId } = req;
  const { date, time } = getDate();
  try {
    const attInfo = await Attendance.findOne({
      memberId: userId,
      attDate: date,
    });
    // attInfo가 있으면 이미 체크인된 사용자
    if (attInfo) {
      return res.status(200).json({
        message: "이미 체크인된 사용자입니다.",
        isCheckIn: true,
        id: attInfo.memberId,
        date: attInfo.attDate,
        time: attInfo.attDatetime,
      });
    }
    // attInfo가 null이면 체크인되지 않은 사용자
    return res
      .status(200)
      .json({ message: "체크인된 사용자가 아닙니다.", isCheckIn: false });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

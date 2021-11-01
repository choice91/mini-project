const Attendance = require("../models/attendance");
const { validationResult } = require("express-validator");
const moment = require("moment");
require("moment-timezone");
require("moment/locale/ko");

moment.tz.setDefault("Asia/Seoul");

// 현재시간을 반환하는 함수
const getDate = () => {
  const [date, time] = moment().format("YYYY-MM-DD HH:mm:ss").split(" ");
  return { date, time };
};

// 날짜시간을 한글로 포맷
const dateFormatFn = (date, time) => {
  const result = moment(`${date} ${time}`)
    .format("YYYY년 M월 D일 dd A h시 m분")
    .split(" ");
  const formatDate = `${result[0]} ${result[1]} ${result[2]} (${result[3]})`;
  const formatTime = `${result[4]} ${result[5]} ${result[6]}`;
  return { formatDate, formatTime };
};

// 체크인
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
  try {
    const { date, time } = getDate();
    const info = await Attendance.findOne({ memberId: userId }).sort({
      attDate: "desc",
    });
    if (info) {
      if (info.attDate === date) {
        return res.status(200).json({ message: "이미 체크인 되었습니다." });
      }
    }
    const checkInInfo = await Attendance.create({
      memberId: userId,
      attDate: date,
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

// 출석정보 검색
exports.getAttInfo = async (req, res, next) => {
  // 현재 페이지
  const currentPage = req.query.page || 1;
  // 한페이지에 보여줄 게시물의 수
  const perPage = 8;
  try {
    // Attendance 모델의 모든 정보 검색 (페이지네이션)
    const attInfo = await Attendance.find({})
      .sort({ attDate: "desc" })
      .populate("memberId");
    if (attInfo.length === 0) {
      return res.status(401).json({ message: "출석 정보를 찾을 수 없습니다." });
    }
    // DB의 날짜와 시간 포맷
    const { formatDate, formatTime } = dateFormatFn(
      attInfo[0].attDate,
      attInfo[0].attDatetime
    );
    // 날짜별로 result배열에 저장
    const result = [];
    let object = {
      date: formatDate,
      users: [
        {
          _id: attInfo[0]._id,
          time: formatTime,
          name: attInfo[0].memberId.name,
          message: attInfo[0].message,
        },
      ],
    };
    result.push(object);
    for (let i = 1; i < attInfo.length; i++) {
      const { formatDate, formatTime } = dateFormatFn(
        attInfo[i].attDate,
        attInfo[i].attDatetime
      );
      if (formatDate === result[result.length - 1].date) {
        result[result.length - 1].users.push({
          _id: attInfo[i]._id,
          time: formatTime,
          name: attInfo[i].memberId.name,
          message: attInfo[i].message,
        });
      } else {
        object = {
          date: formatDate,
          users: [
            {
              _id: attInfo[i]._id,
              time: formatTime,
              name: attInfo[i].memberId.name,
              message: attInfo[i].message,
            },
          ],
        };
        result.push(object);
      }
    }
    const perPageResult = result.slice(
      (currentPage - 1) * perPage,
      currentPage * 8
    );
    const totalItems = result.length;
    return res
      .status(200)
      .json({ ok: true, info: perPageResult, totalItems: totalItems });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

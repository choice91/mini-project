const Attendance = require("../models/attendance");
const { validationResult } = require("express-validator");

// 현재시간을 반환하는 함수
const getDate = () => {
  const [date, datetime] = new Date(Date.now() + 1000 * 60 * 60 * 9)
    .toISOString()
    .split("T");
  const time = datetime.split(".")[0];
  return { date, time };
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
  const { date, time } = getDate();
  try {
    const info = await Attendance.findOne({ memberId: userId }).sort({
      attDate: "desc",
    });
    if (!info || info.attDate !== date) {
      const checkInInfo = await Attendance.create({
        memberId: userId,
        attDate: date,
        attDatetime: time,
        message: message || "😊",
      });
      return res
        .status(201)
        .json({ message: "정상적으로 체크인 되었습니다.", info: checkInInfo });
    }
    return res.status(200).json({ message: "이미 체크인 되었습니다." });
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
    // 모든 데이터의 개수
    // const totalItems = await Attendance.find({}).countDocuments();
    // Attendance 모델의 모든 정보 검색 (페이지네이션)
    const attInfo = await Attendance.find({})
      .sort({ attDate: "desc" })
      .populate("memberId");
    if (attInfo.length === 0) {
      return res.status(200).json({ message: "출석 정보를 찾을 수 없습니다." });
    }
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

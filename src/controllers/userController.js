const bcrypt = require("bcrypt");

const User = require("../models/user");
const Attendance = require("../models/attendance");

// 사용자 프로필 정보 검색
exports.getUserProfile = async (req, res, next) => {
  const { userId } = req;
  try {
    // 사용자정보 검색
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(204)
        .json({ ok: false, message: "사용자 정보를 찾을 수 없습니다." });
    }
    // 사용자의 출석한 날
    const daysOfAttendance = await Attendance.find(
      { memberId: userId },
      { attDate: 1, attDatetime: 1, message: 1 }
    ).sort({ attDate: "desc" });
    if (!daysOfAttendance) {
      return res
        .status(204)
        .json({ ok: false, message: "출석 정보 조회 실패" });
    }
    let userEmail;
    if (user.provider === "local") {
      userEmail = user.email;
    } else if (user.provider === "naver") {
      userEmail = "네이버로 로그인 되었습니다.";
    }
    return res.status(200).json({
      ok: true,
      email: userEmail,
      name: user.name,
      subscriptionDate: user.memberSince,
      daysOfAttendance: daysOfAttendance,
      numberOfDaysOfAtt: daysOfAttendance.length,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// 비밀번호 변경
exports.changePassword = async (req, res, next) => {
  const {
    body: { currentPwd, newPwd },
    userId,
  } = req;
  try {
    // 유저 정보 검색
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(406)
        .json({ ok: false, message: "사용자 정보가 존재하지 않습니다." });
    }
    // 비밀번호 일치여부 확인
    const isPwdEqual = await bcrypt.compare(currentPwd, user.password);
    // 비밀번호가 일치하지 않을 때
    if (!isPwdEqual) {
      return res.status(304).json({
        ok: false,
        message: "비밀번호가 일치하지 않아 비밀번호를 변경할 수 없습니다.",
      });
    }
    // 새로운 비밀번호 해싱
    const newPassword = await bcrypt.hash(newPwd, 12);
    // 새로운 비밀번호 저장
    user.password = newPassword;
    await user.save();
    return res
      .status(200)
      .json({ ok: true, message: "비밀번호 변경이 완료되었습니다." });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// 사용자 정보 수정
exports.changeProfile = async (req, res, next) => {
  const {
    userId,
    body: { username, password },
  } = req;
  try {
    // 닉네임 중복 검사
    const existUser = await User.findOne({ name: username });
    if (existUser) {
      return res
        .status(205)
        .json({ ok: false, message: "이미 존재하는 이름입니다." });
    }
    // 사용자 정보 검색
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(406)
        .json({ ok: false, message: "사용자 정보가 존재하지 않습니다." });
    }
    // 비밀번호가 일치여부 확인
    const isPwdEqual = await bcrypt.compare(password, user.password);
    // 비밀번호가 일치하지 않을 경우
    if (!isPwdEqual) {
      return res
        .status(400)
        .json({ ok: false, message: "비밀번호가 일치하지 않습니다." });
    }
    user.name = username;
    await user.save();
    return res
      .status(200)
      .json({ ok: true, message: "이름 변경이 완료되었습니다." });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

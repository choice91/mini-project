const bcrypt = require("bcrypt");

const User = require("../models/user");

// 유저 프로필 정보
exports.getUserProfile = async (req, res, next) => {
  const { userId } = req;
  try {
    // 유저정보 검색
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(204)
        .json({ ok: false, message: "사용자 정보를 찾을 수 없습니다." });
    }
    return res.status(200).json({ ok: true, user: user });
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
    // 비밀번호 일치여부 확인
    const isPwdEqual = await bcrypt.compare(currentPwd, user.password);
    console.log(isPwdEqual);
    // 비밀번호가 일치하지 않을 때
    if (!isPwdEqual) {
      return res.status(401).json({
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
  return res.end();
};

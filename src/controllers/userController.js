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

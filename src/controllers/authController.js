const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const moment = require("moment");

const User = require("../models/user");

// 회원가입
exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation error");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const { email, name, password } = req.body;
  try {
    const emailExists = await User.exists({ email: email });
    if (emailExists) {
      return res.status(409).json({ message: "이미 가입된 이메일입니다." });
    }
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 12);
    // 회원가입
    const user = await User.create({
      email,
      name,
      password: hashedPassword,
      memberSince: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    return res
      .status(201)
      .json({ ok: true, message: "회원가입 성공", user: user._id });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// 로그인
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // 로그인 한 사용자가 있는지 확인
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("이 이메일을 가진 사용자를 찾을 수 없습니다.");
      error.statusCode = 401;
      throw error;
    }
    // 비밀번호 비교
    const isEqual = await bcrypt.compare(password, user.password);
    // 비밀번호가 일치하지 않으면 에러발생
    if (!isEqual) {
      const error = new Error("비밀번호 틀림");
      error.statusCode = 401;
      throw error;
    }
    // JWT 토큰 생성
    // 페이로드
    const payload = {
      name: user.name,
      userId: user._id.toString(),
    };
    // 옵션
    const options = { expiresIn: "30d" };
    // 토큰
    const token = jwt.sign(payload, process.env.JWT_KEY, options);
    return res.status(200).json({
      ok: true,
      message: "로그인 성공",
      token,
      userId: user._id.toString(),
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

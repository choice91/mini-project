const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

// 회원가입
exports.signup = async (req, res, next) => {
  const { email, name, password } = req.body;
  try {
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 12);
    // 회원가입
    const user = await User.create({
      email,
      name,
      password: hashedPassword,
    });
    console.log(user);
    return res
      .status(201)
      .json({ ok: true, message: "Signup success", user: user._id });
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
      const error = new Error("A user with this email could not be found.");
      error.statusCode = 401;
      throw error;
    }
    // 비밀번호 비교
    const isEqual = await bcrypt.compare(password, user.password);
    // 비밀번호가 일치하지 않으면 에러발생
    if (!isEqual) {
      const error = new Error("Wrong password.");
      error.statusCode = 401;
      throw error;
    }
    // JWT 토큰 생성
    // 페이로드
    const payload = {
      email: user.email,
      userId: user._id.toString(),
    };
    // 옵션
    const options = { expiresIn: "1h" };
    // 토큰
    const token = jwt.sign(payload, process.env.JWT_KEY, options);
    return res.status(200).json({
      ok: true,
      message: "Login success",
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

const jwt = require("jsonwebtoken");
const { body } = require("express-validator");

exports.signupValidate = [
  body("email").isEmail().normalizeEmail().withMessage("잘못된 이메일입니다"),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("The password must be at least 5 letters"),
  body("name").notEmpty().withMessage("이름을 입력해주세요"),
];

exports.isAuth = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("인증되지 않음");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_KEY);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      error.statusCode = 498;
      error.message = "토큰 유효기간 만료";
      throw error;
    }
    error.statusCode = 401;
    error.message = "인증되지 않음";
    throw error;
  }
  // if (!decodedToken) {
  //   const error = new Error("인증되지 않음");
  //   error.statusCode = 401;
  //   throw error;
  // }
  req.userId = decodedToken.userId;
  next();
};

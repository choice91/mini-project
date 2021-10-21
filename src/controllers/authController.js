const bcrypt = require("bcrypt");

const User = require("../models/user");

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
  return res.send("sign up");
};

const jwt = require("jsonwebtoken");

let clientUrl;
if (process.env.NODE_ENV === "production") {
  clientUrl = "http://atts.com.s3-website.ap-northeast-2.amazonaws.com";
} else if (process.env.NODE_ENV === "development") {
  clientUrl = "http://localhost:3000";
}

exports.naverLogin = (req, res, next) => {
  console.log("req.user ::", req.user);
  const { name, _id } = req.user;
  try {
    const payload = { name, userId: _id };
    const options = { expiresIn: "1h" };
    const token = jwt.sign(payload, process.env.JWT_KEY, options);
    return res.status(200).redirect(`${clientUrl}/naver?token=${token}`);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

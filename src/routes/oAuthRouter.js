const express = require("express");
const passport = require("passport");

const { naverLogin, kakaoLogin } = require("../controllers/oAuthController");

const router = express.Router();

router.get("/naver", passport.authenticate("naver"));
router.get(
  "/naver/callback",
  passport.authenticate("naver", { failureRedirect: "/" }),
  naverLogin
);

router.get("/kakao", passport.authenticate("kakao"));

router.get(
  "/kakao/callback",
  passport.authenticate("kakao", { failureRedirect: "/" }),
  kakaoLogin
);

module.exports = router;

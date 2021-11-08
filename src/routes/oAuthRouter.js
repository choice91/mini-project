const express = require("express");
const passport = require("passport");

const { naverLogin } = require("../controllers/oAuthController");

const router = express.Router();

router.get("/naver", passport.authenticate("naver"));
router.get(
  "/naver/callback",
  passport.authenticate("naver", { failureRedirect: "/" }),
  naverLogin
);

module.exports = router;

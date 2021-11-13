const passport = require("passport");

const naver = require("./naverStrategy");
const kakao = require("./kakaoStrategy");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  naver();
  kakao();
};

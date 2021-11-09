const passport = require("passport");

const naver = require("./naverStrategy");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  naver();
};

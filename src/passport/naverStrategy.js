const passport = require("passport");
const NaverStrategy = require("passport-naver").Strategy;
const moment = require("moment");

const User = require("../models/user");

module.exports = () => {
  passport.use(
    new NaverStrategy(
      {
        clientID: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("accessToken ::", accessToken);
        console.log("refreshToken ::", refreshToken);
        console.log("profile ::", profile);
        try {
          const user = await User.findOne({ socialId: profile.id });
          if (user) {
            user.name = profile.displayName;
            user.socialId = profile.id;
            await user.save();
            return done(null, user);
          }
          // 네이버 프로필 정보로 가입
          const newUser = await User.create({
            email: profile._json.email,
            name: profile.displayName,
            socialOnly: true,
            provider: "naver",
            socialId: profile.id,
            memberSince: moment().format("YYYY-MM-DD HH:mm:ss"),
          });
          return done(null, newUser);
        } catch (error) {
          console.log(error);
          done(error);
        }
      }
    )
  );
};

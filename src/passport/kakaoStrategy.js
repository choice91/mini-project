const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const moment = require("moment");

const { User } = require("../models/user");

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_CLIENT_ID,
        clientSecret: process.env.KAKAO_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await User.findOne({
            where: { socialId: profile.id, provider: "kakao" },
          });
          if (user) {
            done(null, user);
          } else {
            const newUser = await User.create({
              email: profile._json.email,
              name: profile.displayName,
              socialOnly: true,
              socialId: profile.id,
              provider: "kakao",
              memberSince: moment().format("YYYY-MM-DD HH:mm:ss"),
            });
            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};

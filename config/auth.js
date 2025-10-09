import passport from 'passport';
import {Strategy as GitHubStrategy} from 'passport-github2';
console.log("GitHub Client ID:", process.env.GITHUB_CLIENT_ID);
console.log("GitHub Client Secret:", process.env.GITHUB_CLIENT_SECRET ? "Loaded ✅" : "Missing ❌");

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('✅ GitHub login successful:', profile.username);
      return done(null, profile);
    }
  )
);
// Serialize/deserialize for session persistence
passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((obj, done) => done(null, obj))

export default passport
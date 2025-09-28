import passport from 'passport';
import {Strategy as GitHubStrategy} from 'passport-github2';
console.log("GitHub Client ID:", process.env.GITHUB_CLIENT_ID);
console.log("GitHub Client Secret:", process.env.GITHUB_CLIENT_SECRET ? "Loaded ✅" : "Missing ❌");

// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: process.env.GITHUB_CLIENT_ID,     // from Google Cloud
//       clientSecret: process.env.GITHUB_CLIENT_SECRET,
//       callbackURL:"http://localhost:3000/auth/github/callback"
//     },
//     (accessToken, refreshToken, profile, done) => {
//       // Here you’d lookup/create the user in your DB
//       const user = {
//         id: profile.id,
//         username: profile.username,
//         name: profile.displayName || profile.username,
//         email: profile.emails && profile.emails.length > 0
//           ? profile.emails[0].value
//           : null // fallback if no email
//       };
//       return done(null, user)
//     }
//   )
// )
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback",
      scope: ["user:email"] // important to request emails
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let email = null;

        // Try profile.emails first
        if (profile.emails && profile.emails.length > 0) {
          email = profile.emails[0].value;
        } else {
          // Fallback: Fetch emails from GitHub API
          const res = await fetch("https://api.github.com/user/emails", {
            headers: {
              Authorization: `token ${accessToken}`,
              "User-Agent": "enrolment-manager"
            }
          });
          const emails = await res.json();

          if (Array.isArray(emails)) {
            const primaryEmail = emails.find(e => e.primary) || emails[0];
            email = primaryEmail ? primaryEmail.email : null;
          }
        }

        const user = {
          id: profile.id,
          username: profile.username,
          name: profile.displayName || profile.username,
          email
        };

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
// Serialize/deserialize for session persistence
passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((obj, done) => done(null, obj))

export default passport
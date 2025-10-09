import express from "express";
import passport from "../config/auth.js";
const router = express.Router();

// Start GitHub login
router.get("/auth/github",
  passport.authenticate("github")
);

// Callback after GitHub auth
router.get(
  "auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/dashboard'); // redirect to dashboard after success
  }
)

// Logout user
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.redirect('/');
    });
  });
});

export default router;

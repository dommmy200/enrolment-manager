import express from "express";
import passport from "../config/auth.js";

const router = express.Router();

// Start GitHub login
router.get("/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// Callback after GitHub auth
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.json({ message: "GitHub login successful!", user: req.user });
  }
);

export default router;

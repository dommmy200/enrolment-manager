import express from "express";
import fetch from "node-fetch";
import passport from "../config/auth.js";
import { issueToken } from "../config/jwt.js";

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
    const token = issueToken(req.user);
    res.json({ message: "GitHub login successful!", token });
  }
)

/**
 * Exchange GitHub OAuth code for a School API JWT
 * This matches Swagger's `tokenUrl`
 */
router.post("/token", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Missing authorization code" });
  }

  try {
    // 1. Exchange the code for a GitHub access token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      })
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error_description });
    }

    const githubAccessToken = tokenData.access_token;

    // 2. Use GitHub token to fetch user profile
    const userResponse = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${githubAccessToken}` }
    });

    const githubUser = await userResponse.json();

    // 3. Issue School API token
    const schoolToken = issueToken({
      id: githubUser.id,
      name: githubUser.name || githubUser.login
    });

    res.json({
      message: "School API token issued successfully!",
      token: schoolToken
    });

  } catch (err) {
    console.error("Token exchange failed:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;

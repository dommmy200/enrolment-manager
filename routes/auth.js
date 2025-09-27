const express = require('express');
const router = express.Router();
const passport = require('passport');
const { generateToken } = require('../middleware/authenticate'); // Import token generator

/**
 * @swagger
 * /auth/github:
 * get:
 * tags:
 * - Auth
 * summary: Start the GitHub OAuth flow.
 * description: Redirects the user to GitHub for authentication.
 * responses:
 * 302:
 * description: Redirect to GitHub.
 */
router.get('/github', 
    passport.authenticate('github', { scope: ['user:email'] })
);

/**
 * @swagger
 * /auth/github/callback:
 * get:
 * tags:
 * - Auth
 * summary: GitHub OAuth callback endpoint.
 * description: Handles the redirect back from GitHub, authenticates the user, and issues a JWT.
 * responses:
 * 200:
 * description: Authentication successful. Returns JWT.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: Authentication successful. Use this token for API access.
 * token:
 * type: string
 * description: The JWT valid for 1 hour.
 * 401:
 * description: Authentication failed.
 */
router.get('/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/api-docs', // Redirect to docs on failure
        session: false // Crucial: Disable Passport session usage for JWT API
    }),
    (req, res) => {
        // Successful authentication, generate JWT
        const token = generateToken(req.user);
        
        // Return the token to the client
        res.status(200).json({
            message: "Authentication successful. Use this token for API access.",
            token: token
        });
    }
);

// Optional: Logout route (simply instructs the client to discard the token)
/**
 * @swagger
 * /auth/logout:
 * get:
 * tags:
 * - Auth
 * summary: Logout (Client-side token disposal).
 * description: Endpoint instructing the client to clear their locally stored JWT.
 * responses:
 * 200:
 * description: Logout successful.
 */
router.get('/logout', (req, res) => {
    res.status(200).send("Logout successful. Please discard your API token.");
});

module.exports = router;

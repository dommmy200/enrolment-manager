const express = require('express')
const router = require('./routes/index')
const dotenv = require('dotenv')
const mongodb = require('./data/database')
const cors = require('cors')
const passport = require('passport')
const GithubStrategy = require('passport-github2').Strategy
const path = require('path');
const User = require('./models/user'); 

// Set the port
const port = process.env.PORT || 3000

const app = express()
dotenv.config()

// Middleware
app.use(express.json()) // Enables parsing of JSON body data
    .use(cors({
        // Allow all origins, methods, and headers for the Canvas environment
        origin: '*', 
        methods: ["GET", "POST", "UPDATE", "DELETE", "PUT", "PATCH"],
        allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Z-Key", "Authorization"] // Essential for JWT
    }))
    .use(passport.initialize()) // Initialize Passport for OAuth flow
    .use('/', router) // Mount the main router with all API routes

// Global Error Handler: Catches errors thrown by 'next(err)' in controllers/middleware
app.use((err, req, res, next) => {
    // Log the error stack for server-side debugging
    console.error("Global Error Handler Caught:", err.stack); 
    
    // Respond with appropriate status or 500 Internal Server Error
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined // Show stack only in dev
    });
});

// --- Passport Configuration ---

passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            // Find or Create the user in the database
            let currentUser = await User.findOne({ githubId: profile.id });

            if (currentUser) {
                // User exists: Pass the database record
                done(null, currentUser); 
            } else {
                // New user: Create and save the record
                const newUser = await new User({
                    githubId: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails ? profile.emails[0].value : null 
                }).save();
                
                done(null, newUser);
            }
        } catch (err) {
            // Handle any database error
            done(err, null);
        }
    }
));

// Required stubs for Passport, even though sessions are disabled (session: false in auth.js)
passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

// --- Database and Server Start ---

mongodb.initDatabase((err, client) => {
    if (err) {
        console.log("Database connection failed:", err)
        process.exit(1);
    }
    app.listen(port, () => {
        console.log(`\n\nWeb server listening on port ${port}`)
        console.log(`API Documentation available at: http://localhost:${port}/api-docs\n`)
    })
})

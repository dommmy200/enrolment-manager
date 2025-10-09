// ===============================================
// IMPORT REQUIRED MODULES
// ===============================================
import 'dotenv/config'

import express from 'express'
const app = express()
import bodyParser from 'body-parser'
import mongodb from './data/database.js'
import cors from 'cors'
import passport from './config/auth.js'
import session from 'express-session'
import { Strategy as GitHubStrategy } from 'passport-github2' // OAuth GitHub authentication
import router from './routes/index.js'


// import MongoStore from 'connect-mongo'
// import authRouter from './routes/authRoutes.js'

// import swaggerRouter from "./routes/swagger.js";
// import studentRoutes from "./routes/students.js";
// import instructorRoutes from "./routes/instructors.js";
// import courseRoutes from "./routes/courses.js";

const port = process.env.PORT || 3000

// app.use(express.json()); // Parse JSON bodies
// app.use(express.static("public"));

// app.use(cors({
//     origin: '*',
//     methods: ["GET", "POST", "UPDATE", "DELETE"],
//    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Authorization"]
// }))
// // Session middleware (required by passport)
// app.use(
//     session({
//         store: MongoStore.create({ 
//             mongoUrl: process.env.MONGO_URL,
//             ttl: 14 * 24 * 60 * 60  
//         }),
//         secret: process.env.SESSION_SECRET || "supersecret",
//         resave: false,
//         saveUninitialized: false
//     })
// );
// app.use(passport.initialize())
// app.use(passport.session())

// app.use('/', router)
// app.use("/auth", authRouter)
// // Swagger
// app.use(swaggerRouter);

// // Routes
// app.use("/students", studentRoutes);
// app.use("/instructors", instructorRoutes);
// app.use("/courses", courseRoutes);

// mongodb.initDatabase((err) => {
//     if (err) {
//         console.log(err)
//         process.exit(1)
//     } else {
//         app.listen(port, () =>  {
//             console.log(`Database is connected. Server is live on Port: ${port}`)
//              console.log(`API Documentation available at: http://localhost:${port}/api-docs\n`)
//         })
//     }
// })


// ===============================================
// IMPORT REQUIRED MODULES
// ===============================================
// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');
// const mongodb = require('./data/database'); // Database connection setup
// const cors = require('cors');
// const passport = require('passport');
// const session = require('express-session');
// const GitHubStrategy = require('passport-github2').Strategy; // OAuth GitHub authentication
// const port = process.env.PORT || 5000; // Define port (use env variable or default 5000)


// ===============================================
// MIDDLEWARE CONFIGURATION
// ===============================================
app
  // Parse incoming JSON requests
  .use(bodyParser.json())

  // Parse URL-encoded data (for form submissions)
  .use(bodyParser.urlencoded({ extended: true }))

  // Initialize express-session for session management
  .use(session({
        secret: 'team_seven_rocks', // Session encryption key (keep private)
        resave: false,              // Don’t resave session if unmodified
        saveUninitialized: true     // Save uninitialized sessions
    }))

  // ===============================================
  // PASSPORT AUTHENTICATION SETUP
  // ===============================================

  // Initialize Passport for authentication
  .use(passport.initialize())

  // Enable persistent login sessions
  .use(passport.session())

  // ===============================================
  // CORS AND CUSTOM HEADERS
  // ===============================================
  // Allow cross-origin requests and define accepted methods/headers
  .use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      next();
  })

  // Mount main application routes
  .use('/', router)

  // Enable CORS with additional method configuration
  .use(cors({ methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'UPDATE']}))
  .use(cors({ origin: '*' }));


// ===============================================
// PASSPORT GITHUB STRATEGY CONFIGURATION
// ===============================================
passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,       // GitHub OAuth Client ID
    clientSecret: process.env.GITHUB_CLIENT_SECRET, // GitHub OAuth Secret
    callbackURL: process.env.CALLBACK_URL         // URL to handle GitHub OAuth callback
  },
  // This callback executes after GitHub authentication is successful
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

// Serialize user info into the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user info from the session
passport.deserializeUser((user, done) => {
  done(null, user);
});


// ===============================================
// ROUTES
// ===============================================

// Root route – displays login status
app.get('/', (req, res) => {
    res.send(
      req.session.user !== undefined
        ? `Logged in as ${req.session.user.displayName}`
        : 'Logged out'
    );
});

// GitHub OAuth callback route
app.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/api-docs', session: false }),
  (req, res) => {
    req.session.user = req.user; // Store user info in session after successful login
    res.redirect('/');           // Redirect to homepage
  }
);


// ===============================================
// GLOBAL ERROR HANDLING
// ===============================================
// Handle unexpected runtime errors and prevent app from crashing
process.on('uncaughtException', (err, origin) => {
    console.log(process.stderr.fd, `Caught exception: ${err}\nException origin: ${origin}`);
});


// ===============================================
// DATABASE CONNECTION AND SERVER START
// ===============================================
mongodb.initDatabase((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`✅ Connected to Database and listening on port ${port}`);
      console.log(`API Documentation available at: http://localhost:${port}/api-docs\n`)
    });
  }
});

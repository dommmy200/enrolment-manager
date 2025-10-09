// ===============================================
// IMPORT REQUIRED MODULES
// ===============================================
import 'dotenv/config'
import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import cors from 'cors'
import passport from './config/auth.js'
import authRoutes from './routes/auth.js' // OAuth GitHub authentication
import mongodb from './data/database.js'
import router from './routes/index.js'

const app = express()
const port = process.env.PORT || 3000

// ===============================================
// MIDDLEWARE CONFIGURATION
// ===============================================
app.use(bodyParser.json()) // Parse incoming JSON requests
app.use(bodyParser.urlencoded({ extended: true })) // Parse URL-encoded data (for form submissions)

  // Initialize express-session for session management
  app.use(session({
        secret: process.env.SESSION_SECRET, // Session encryption key (keep private)
        resave: false,              // Don’t resave session if unmodified
        saveUninitialized: true     // Save uninitialized sessions
    }))

  // ===============================================
  // PASSPORT AUTHENTICATION SETUP
  // ===============================================

  // Initialize Passport for authentication
  app.use(passport.initialize())

  // Enable persistent login sessions
  app.use(passport.session())
  app.use('/', authRoutes);
  app.use(cors({origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE']}))
  // Mount main application routes
  app.use('/', router)

// ===============================================
// ROUTES
// ===============================================

// Root route – displays login status
app.get('/', (req, res) => {
    res.send(
      req.session.user
        ? `Logged in as ${req.session.user.displayName}`
        : '👋 Welcome! Please log in with GitHub at /auth/github'
    );
});

// Dashboard
app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Unauthorized');
  }
  res.send(`🎉 Welcome to your dashboard, ${req.session.user.displayName}!`);
});

// ===============================================
// DATABASE CONNECTION AND SERVER START
// ===============================================
mongodb.initDatabase((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(port, () => {
      console.log(`✅ Connected to Database and listening on port ${port}`);
     console.log(`🔗 Visit: https://enrolment-manager.onrender.com`);
    });
  }
});

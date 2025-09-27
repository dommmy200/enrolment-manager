const express = require('express')
// const bodyParser = require('body-parser')
const router = require('./routes/index')
const dotenv = require('dotenv')
const mongodb = require('./data/database')
const cors = require('cors')
const passport = require('passport')
const session = require('express-session')
const GithubStrategy = require('passport-github2').Strategy
const path = require('path');
const User = require('./models/user'); 
// ...

const port = process.env.PORT || 3000

const app = express()
dotenv.config()

app.set('views', path.join(__dirname, 'views')); // <-- This mounts the 'views' directory
app.set('view engine', 'ejs');
// Middleware
app.use(express.json())
    .use(cors({
        origin: '*',
        methods: ["GET", "POST", "UPDATE", "DELETE", "PUT", "PATCH"],
        allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Z-Key"]
    }))
    .use(session({
        secret: "secret",
        resave: false,
        saveUninitialized: true
    }))
    .use(passport.initialize())
    .use(passport.session())
    .use('/', router)

// Routes
app.get('/', (req, res) => {
    // Corrected syntax for the ternary operator
    res.send((req.session.user !== undefined) ? `Logged in as ${req.session.user.displayName}` : "Logged Out")
})

// app.get('/github/callback',
//     passport.authenticate('github', {
//         failureRedirect: '/api-docs'
//     }),
//     (req, res) => {
//         // This function now runs after a successful authentication and a session has been created by passport.session()
//         res.redirect('/') // The req.user is automatically stored in the session by serializeUser
//     }
// );

// Passport Configuration
// passport.use(new GithubStrategy({
//     clientID: process.env.GITHUB_CLIENT_ID,
//     clientSecret: process.env.GITHUB_CLIENT_SECRET,
//     callbackURL: process.env.CALLBACK_URL
// },
//     function (accessToken, refreshToken, profile, done) {
//         // The profile object is correctly passed to the serializer
//         return done(null, profile)
//     }
// ))


passport.use(new GithubStrategy({
    // ... config here ...
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
    async function (accessToken, refreshToken, profile, done) {
        
        try {
            // Find user by their unique GitHub ID
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
passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

// Database and Server Start
mongodb.initDatabase((err, client) => {
    if (err) {
        console.log(err)
    }
    app.listen(port, () => {
        console.log(`Web server listening on port ${port}`)
    })
})
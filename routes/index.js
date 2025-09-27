const express = require('express')
const router = express.Router()
const swaggerUi = require('swagger-ui-express')
const swaggerDocument  = require('../swagger')l
const jwt = require("jsonwebtoken")
const studentsRoute = require('./students')
const coursesRoute = require('./courses')
const instructorRoute = require('./instructors')
const passport = require('passport')
const {authenticateJWT} = require('../middleware/authenticate')
const User = require('../models/user');

router.get('/', (req, res, next) => {
    res.send('Enrollment Management App Home!')
})

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(401).json({ message: 'User not found' });

  // Password check here...

  const token = generateToken(user);
  res.json({ token });
});

// router.get('/login', passport.authenticate('github'), (req, res) => {})
router.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
)

router.get('/auth/github/callback',
    // 1. CRITICAL: Disable Passport session management
    passport.authenticate('github', { 
        failureRedirect: '/',
        session: false // <--- Tells Passport NOT to set the session cookie
    }),
    (req, res) => {
        // req.user is the object passed from the strategy's done(null, user)

        // 2. Safely access user properties from the database object
        const user = req.user; 
        
        // Define the payload for the JWT
        const payload = { 
            // Use the MongoDB ID as the unique identifier
            id: user._id, 
            // Use displayName as a useful identifier in the token
            displayName: user.displayName 
        };
        
        // 3. Create the JWT
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "1h" } // Token expires after 1 hour
        );

        // 4. Respond with the JWT (and user details, optionally)
        res.status(200).json({ 
            message: 'Authentication successful',
            token: token,
            userId: user._id
        });
    }
);
// router.get('/logout', function (req, res, next) {
//     req.logOut(function (err) {
//         if (err) {
//             return next(err)
//         }
//         res.redirect('/')
//     })
// })
// ------------------------------------------------------------------
// 1. Protected Route Example: /profile (User Experience)
// ------------------------------------------------------------------
router.get('/profile', authenticateJWT, (req, res) => {
    // If the user reaches this point, they are logged in.
    // req.user contains the user data from your deserializeUser function.
    // #swagger.tags = ['Users']
    // #swagger.description = 'Get the logged-in user profile'
    // #swagger.security = [{"cookieAuth": []}]
    // #swagger.responses[200] = {
    //   description: "User profile",
    //   schema: {
    //     type: 'object',
    //     properties: {
    //       id: { type: 'string', example: '12345' },
    //       email: { type: 'string', example: 'user@example.com' },
    //       displayName: { type: 'string', example: 'John Doe' }
    //     }
    //   }
    // }
    res.render('profile', {
        title: `${req.user.name || req.user.displayName}'s Profile`,
        user: req.user
    });
});

// router.use('/api-docs', swaggerUi.serve);
// router.get('/api-docs', swaggerUi.setup(swaggerSpec));
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// router.use('/', require('./swagger'))
router.use('/students', studentsRoute)
router.use('/courses', coursesRoute)
router.use('/instructors', instructorRoute)

module.exports = router
const express = require('express')
const router = express.Router()
const swaggerUi = require('swagger-ui-express')
const {swaggerSpec} = require('../swagger/swagger-config')
const {swaggerDocument}  = require('../swagger/swagger-config')
const jwt = require("jsonwebtoken")
const studentsRoute = require('./students')
const coursesRoute = require('./courses')
const instructorRoute = require('./instructors')
const passport = require('passport')
const {authenticateJWT} = require('../middleware/authenticate')

router.get('/', (req, res, next) => {
    res.send('Enrollment Management App Home!')
})

router.post('/login', async (req, res) => {
  const user = await user.findOne({ email: req.body.email });

  if (!user) return res.status(401).json({ message: 'User not found' });

  // Password check here...

  const token = generateToken(user);
  res.json({ token });
});

// router.get('/login', passport.authenticate('github'), (req, res) => {})
router.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
)

// router.get('/github/callback',
//     passport.authenticate('github', {
//         failureRedirect: '/login'
//     }),
//     (req, res) => {
//         // This function now runs after a successful authentication and a session has been created by passport.session()
//         res.redirect('/profile') // The req.user is automatically stored in the session by serializeUser
//     }
// )
router.get('/auth/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/'
    }),
    (req, res) => {
    // Create JWT when GitHub login succeeds
        const user = req.user; // passport sets this
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        // Send token as JSON instead of redirect
        res.json({ token })
    }
)
router.get('/logout', function (req, res, next) {
    req.logOut(function (err) {
        if (err) {
            return next(err)
        }
        res.redirect('/')
    })
})
// ------------------------------------------------------------------
// 1. Protected Route Example: /profile (User Experience)
// ------------------------------------------------------------------
router.get('/profile', authenticateJWT, (req, res) => {
    // If the user reaches this point, they are logged in.
    // req.user contains the user data from your deserializeUser function.
    // #swagger.tags = ['Users']
    // #swagger.description = 'Get the logged-in user profile'
    // #swagger.security = [{ "bearerAuth": [] }]
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
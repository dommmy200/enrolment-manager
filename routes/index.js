import express from "express"
import passport from 'passport'
import authRoutes from "./authRoutes.js"
import studentsRoute from './students.js'
import coursesRoute from './courses.js'
import instructorRoute from './instructors.js'
import swaggerRoute from './swagger.js'
const router = express.Router()

// router.get('/', (req, res, next) => {
//     res.send('Hello World!')
// })
// Auth routes (your /auth/google & /auth/google/callback now mounted here)
router.use("/auth", authRoutes);

router.use('/', swaggerRoute)
router.use('/students', studentsRoute)
router.use('/courses', coursesRoute)
router.use('/instructors', instructorRoute)
/**
 * ===================================
 * ROOT ROUTE (Home Page)
 * ===================================
 * This route serves as the entry point of the API.
 * It provides users with a brief guide on available endpoints.
 */
router.get('/', (req, res) => {
    //#swagger.tags = ['Welcome to the Movies API']
    res
      .status(200)
      .send(
        `<h1>Welcome Student Enrollment API</h1>
        <p>Use the <strong>/students</strong> endpoint to manage the Students collection.</p>
        <p>Use the <strong>/courses</strong> endpoint to manage the Courses collection.</p>
        <p>Use the <strong>/instructors</strong> endpoint to manage the Instructors collection.</p>
        `
      );
});

/**
 * ===================================
 * AUTHENTICATION ROUTES
 * ===================================
 * These routes handle user authentication via GitHub OAuth using Passport.js.
 */

// Initiates GitHub login process
// Redirects user to GitHub for authentication
router.get('/login', passport.authenticate('github'), (req, res) => {});

// Logs the user out of the session
// After successful logout, redirects to the home page
router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

/**
 * Export the main router so it can be used in app.js (the main server file)
 */
// module.exports = router;
export default router

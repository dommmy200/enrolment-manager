import express from "express";
import authRoutes from "./authRoutes.js";
import studentsRoute from './students.js';
import coursesRoute from './courses.js'
import instructorRoute from './instructors.js'
import swaggerRoute from './swagger.js'
const router = express.Router()

router.get('/', (req, res, next) => {
    res.send('Hello World!')
})
// Auth routes (your /auth/google & /auth/google/callback now mounted here)
router.use("/auth", authRoutes);

router.use('/', swaggerRoute)
router.use('/students', studentsRoute)
router.use('/courses', coursesRoute)
router.use('/instructors', instructorRoute)


export default router
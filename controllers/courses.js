const mongodb = require('mongodb')
const database = require('../data/database')
const { ObjectId } = require('mongodb')

/**
 * Retrieves all courses from the database.
 * This is an unprotected public route.
 */
const getAllCourses = async (req, res) => {
    try {
        const db = database.getDatabase()
        // NOTE: If you only want to show courses owned by the user, add { userId: req.user._id } filter here.
        // For now, this remains public.
        const courses = await db.collection('courses').find().toArray()
        if (!courses || courses.length === 0) {
            return res.status(404).json({
                message: "No Courses Found!"
            })
        }
        res.status(200).json(courses)
    } catch (err) {
        // Log the error for server visibility
        console.error('Error fetching all courses:', err);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

/**
 * Retrieves a single course by its ID.
 * This is an unprotected public route.
 */
const getOneCourse = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({message: "Invalid Course ID Format!"})
        }
        // Using new ObjectId() constructor is common practice
        const courseId = new ObjectId(req.params.id);
        const db = database.getDatabase()
        const courses = await db.collection('students').findOne({_id: courseId})
        const courses = await db.collection('students').findOne({_id: courseId})
        if (!courses) {
            return res.status(404).json({
                message: "Course Not Found!"
            })
        }
        res.status(200).json(courses)
    } catch (err) {
        console.error('Error fetching one course:', err);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

/**
 * Inserts a new course. Requires authentication and checks for required schema fields.
 * Links the new course to the authenticated user via 'userId'.
 */
const insertOneCourse = async (req, res, next) => {
    
    try {
        // 1. AUTHENTICATION CHECK
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'Unauthorized', message: 'User must be logged in to create a course.' });
        }

        // 2. INPUT VALIDATION: Check for required fields based on the Course schema
        const { title, code, credits, department_id, instructor_id } = req.body;
        if (!title || !code || !credits || !department_id || !instructor_id) {
             return res.status(400).json({ 
                error: 'Missing required fields', 
                message: 'Required fields: title, code, credits, department_id, instructor_id.' 
            });
        }

        const db = database.getDatabase();
        
        const newCourse = {
            // Using standard schema fields
            title: title, 
            code: code, 
            credits: credits, 
            department_id: department_id, 
            instructor_id: instructor_id, 
            
            // Optional/additional fields
            description: req.body.description,
            semester: req.body.semester,

            // 3. AUTHORIZATION/OWNERSHIP: Link to the authenticated user (MANDATORY for protected data)
            userId: req.user._id // Stores the user ID from the JWT payload
        };
        const result = await db.collection('courses').insertOne(newCourse);
        
        // Respond with the created document ID
        res.status(201).json({ 
            message: 'Course created successfully.',
            insertedId: result.insertedId 
        });

    } catch (err) {
        console.error('Insert course error:', err);
        // Pass error to centralized handler
        next(err); 
    }
};

/**
 * Updates an existing course. Requires authentication and ownership check.
 */
const updateCourses = async (req, res, next) => {
    try {
        // 1. AUTHENTICATION
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'Unauthorized', message: 'User must be logged in.' });
        }

        const db = database.getDatabase();
        const courseId = req.params.id;
       
        // 2. VALIDATION
        if (!ObjectId.isValid(courseId)) {
            return res.status(400).json({ error: 'Invalid ID format', message: 'Course ID is not a valid ObjectId.' });
        }
        if (!req.body || Object.keys(req.body).length === 0) {
          return res.status(400).json({ error: 'Update data cannot be empty' });
        }

        // 3. AUTHORIZATION: Filter by ID AND ownership (req.user._id)
        const filter = { 
            _id: new ObjectId(courseId), 
            userId: req.user._id // Ensures only the owner can match the document
        };

        const updateDoc = { $set: req.body };
        const result = await db.collection('courses').updateOne(filter, updateDoc);

        if (result.matchedCount === 0) {
            // Check if the course exists but is not owned by the user (403 Forbidden)
            const checkCourseExists = await db.collection('courses').findOne({ _id: new ObjectId(courseId) });
            
            if (checkCourseExists) {
                 return res.status(403).json({ message: 'Forbidden: You can only update courses you own.' });
            }
            
            // Course doesn't exist at all (404 Not Found)
            return res.status(404).json({ message: 'No course found to update.' });
        }
        
        res.status(200).json({
            message: `Course updated successfully. Modified count: ${result.modifiedCount}.`, 
            result
        });

    } catch (error) {
        console.error('Update error:', error);
        next(error); 
    }
};

/**
 * Deletes an existing course. Requires authentication and ownership check.
 */
const deleteOneCourse = async (req, res, next) => {
    
    try {
        // 1. AUTHENTICATION
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized', message: 'User must be logged in.' });
        }

        const db = database.getDatabase();
        const courseId = req.params.id;

        // 2. VALIDATION
        if (!ObjectId.isValid(courseId)) {
            return res.status(400).json({ error: 'Invalid ID format', message: 'Course ID is not a valid ObjectId.' });
        }

        // 3. AUTHORIZATION: Filter by ID AND ownership (req.user._id)
        const filter = { 
            _id: new ObjectId(courseId), 
            userId: req.user._id // Ensures only the owner can match and delete the document
        };

        const result = await db.collection('courses').deleteOne(filter);

        if (result.deletedCount === 0) {
            // Check if the course exists but is not owned by the user (403 Forbidden)
            const checkCourseExists = await db.collection('courses').findOne({ _id: new ObjectId(courseId) });
            
            if (checkCourseExists) {
                 return res.status(403).json({ message: 'Forbidden: You can only delete courses you own.' });
            }
            
            // Course doesn't exist at all (404 Not Found)
            return res.status(404).json({ message: 'No course found to delete.' });
        }
        
        // Success
        res.status(200).json({ message: 'Course deleted successfully.' });

    } catch (err) {
        console.error('Delete course error:', err);
        next(err); 
    }
};

module.exports = { getAllCourses, getOneCourse, insertOneCourse, updateCourses, deleteOneCourse }

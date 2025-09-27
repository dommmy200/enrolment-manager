const mongodb = require('mongodb')
const database = require('../data/database')
const { ObjectId } = require('mongodb')

const getAllCourses = async (req, res) => {
    //swagger.tags=['Hello World']
    try {
        const db = database.getDatabase()
        const courses = await db.collection('courses').find().toArray()
        if (!courses) {
            return res.status(404).json({
                message: "No Courses Found!"
            })
        }
        res.status(200).json(courses)
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}
const getOneCourse = async (req, res) => {
    //swagger.tags=['Hello World']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({message: "Invalid Format!"})
        }
        const courseId = ObjectId.createFromHexString(req.params.id);
        const db = database.getDatabase()
        const courses = await db.collection('courses').findOne({_id: courseId})
        if (!courses) {
            return res.status(404).json({
                message: "No Courses Found!"
            })
        }
        res.status(200).json(courses)
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

// const insertOneCourse = async (req, res) => {
//     //swagger.tags=['Hello World']
//     const db = database.getDatabase()
//     const updateEnrolment = {
//         course_name: req.body.course_name,
//         description: req.body.description,
//         credits: req.body.credits,
//         department: req.body.department,
//         course: req.body.course,
//         instructor: req.body.instructor,
//         semester: req.body.semester
//     }
//     await db.collection('courses').insertOne(updateEnrolment).then(result =>{
//         res.status(201).json(result)
//     }).catch(err => {
//         res.status(500).json({
//             message: err.message
//         })
//     })
    
// }
const insertOneCourse = async (req, res, next) => {
    
    try {
        // 1. AUTHENTICATION CHECK (Essential for protected data entry)
        if (!req.user || !req.user._id) {
            // This should be caught by the isAuthenticated middleware, but serves as a fail-safe.
            return res.status(401).json({ error: 'Unauthorized', message: 'User must be logged in to create a course.' });
        }

        const db = database.getDatabase();
        
        // const newCourse = {
        //     // Data from the request body
        //     course_name: req.body.course_name,
        //     description: req.body.description,
        //     credits: req.body.credits,
        //     department: req.body.department,
        //     course: req.body.course,
        //     instructor: req.body.instructor,
        //     semester: req.body.semester,
            
        //     // 2. AUTHORIZATION/OWNERSHIP: Link the course to the authenticated user
        //     userId: req.user._id // Stores the MongoDB ObjectId of the current user
        // };

        const newCourse = {
            // Schema Field: 'title' (was course_name in your original object)
            title: req.body.course_name, 

            // Schema Field: 'code' (we'll assume this comes from req.body.course)
            code: req.body.course, 
            
            // Schema Field: 'credits' (matches your original)
            credits: req.body.credits, 

            // Schema Field: 'department_id' (was department in your original object)
            // We assume the body sends the ID string for the department.
            department_id: req.body.department, 
            
            // Schema Field: 'instructor_id' (was instructor in your original object)
            // We assume the body sends the ID string for the instructor.
            instructor_id: req.body.instructor, 
            
            // --- Additional Fields (Not in Schema but often needed) ---
            // You may still want these for internal data, but be aware they are NOT in the public schema.
            description: req.body.description,
            semester: req.body.semester,

            // --- Ownership Link (Crucial for Authorization) ---
            // This is NOT part of the public API schema but is required for server-side security.
            userId: req.user._id // Stores the MongoDB ObjectId of the current user
        };
        const result = await db.collection('courses').insertOne(newCourse);
        
        // Respond with the created document ID (Standard for POST requests)
        res.status(201).json({ 
            message: 'Course created successfully.',
            insertedId: result.insertedId 
        });

    } catch (err) {
        // Pass any caught error (e.g., database connection) to the centralized Express error handler
        console.error('Insert course error:', err);
        next(err); 
    }
};
// const updateCourses = async (req, res) => {
//     try {
//         // 1. AUTHENTICATION (Handled by middleware, but check ensures req.user exists)
//         if (!req.user) {
//             // Should be caught by isAuthenticated middleware, but this is a fail-safe
//             return res.status(401).json({ error: 'Unauthorized', message: 'User must be logged in.' });
//         }

//         // const db = database.getDatabase();
//         // const { id } = req.params;
//         const db = database.getDatabase();
//         const courseId = req.params.id;
       
//         // if (!ObjectId.isValid(id)) {
//         //     return res.status(400).json({ error: 'Invalid ID format'});
//         // }
//         // 2. VALIDATION: Check if ID is a valid MongoDB ObjectId format
//         if (!ObjectId.isValid(courseId)) {
//             return res.status(400).json({ error: 'Invalid ID format', message: 'Course ID is not a valid ObjectId.' });
//         }
//         //  Validate body
//         console.log('Incoming update body:', req.body); // Debug log
//         if (!req.body || Object.keys(req.body).length === 0) {
//           return res.status(400).json({ error: 'Update data cannot be empty' });
//         }

//         // Converts the string id you received (e.g., from a URL parameter) 
//         // into a MongoDB ObjectId instance so MongoDB can match it.
//         // const filter = { 
//         //     _id: new ObjectId(id)
//         // };
//         const filter = { 
//             _id: new ObjectId(courseId), 
//             // 3. AUTHORIZATION: Ensure the logged-in user owns this course
//             userId: req.user._id // Assuming req.user._id is the MongoDB ObjectId of the current user
//         };

//         // Without $set, if you passed req.body directly:
//         // MongoDB would replace the entire document with only the fields in 
//         // req.body, deleting any others not listed. $set avoids that by 
//         // performing a partial update.
//         const updateDoc = { $set: req.body };
//         let course = ''
//         const result = await db.collection('courses').updateOne(filter, updateDoc);
//         // if (result.matchedCount === 0) {
//         //     return res.status(404).json({
//         //         message: 'No matching student found.'
//         //     });
//         // }
//         if (result.matchedCount === 0) {
//             // If the count is 0, it means EITHER the course wasn't found (404) 
//             // OR the user didn't own it (403 Forbidden). 
//             // We default to 404 for security/simplicity in this check.
//             const checkCourseExists = await db.collection('courses').findOne({ _id: new ObjectId(courseId) });
            
//             if (checkCourseExists) {
//                  // Course exists but user doesn't own it
//                  return res.status(403).json({ message: 'Forbidden: You can only update your own courses.' });
//             }
            
//             return res.status(404).json({ message: 'No course found to update.' });
//         }
//         if (result.matchedCount === 1) {
//             course = 'course'
//         } else if (result.matchedCount > 1){
//             course = 'courses'
//         }

//         res.status(200).json({
//             message: `Updated ${result.modifiedCount} ${course}.`, result
//         });
//     } catch (error) {
//         console.error('Update error:', error);
//         res.status(500).json({
//             error: `Internal Server Error!`
//         });
//     }
    
// };
const updateCourses = async (req, res, next) => {
    try {
        // 1. AUTHENTICATION (The isAuthenticated middleware is the primary guard)
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'Unauthorized', message: 'User must be logged in.' });
        }

        const db = database.getDatabase();
        const courseId = req.params.id;
       
        // 2. VALIDATION: Check for valid ObjectId and empty body
        if (!ObjectId.isValid(courseId)) {
            return res.status(400).json({ error: 'Invalid ID format', message: 'Course ID is not a valid ObjectId.' });
        }
        
        // Check for empty body (no update data provided)
        if (!req.body || Object.keys(req.body).length === 0) {
          return res.status(400).json({ error: 'Update data cannot be empty' });
        }

        // 3. AUTHORIZATION: Filter by ID AND ownership (req.user._id)
        const filter = { 
            _id: new ObjectId(courseId), 
            userId: req.user._id // Ensures only the owner can match the document
        };

        // Prepare the update document using $set for partial update
        const updateDoc = { $set: req.body };

        const result = await db.collection('courses').updateOne(filter, updateDoc);

        // --- Handle Result and Authorization Check ---

        if (result.matchedCount === 0) {
            // Check if the course exists at all (owned by someone else)
            const checkCourseExists = await db.collection('courses').findOne({ _id: new ObjectId(courseId) });
            
            if (checkCourseExists) {
                 // Course exists but the update failed because userId didn't match the owner
                 return res.status(403).json({ message: 'Forbidden: You can only update your own courses.' });
            }
            
            // Course doesn't exist at all
            return res.status(404).json({ message: 'No course found to update.' });
        }
        
        // Success: The document was matched (and thus owned by the user) and potentially modified
        // Note: result.modifiedCount can be 0 if the user sends the exact same data
        res.status(200).json({
            message: `Course updated successfully. Modified count: ${result.modifiedCount}.`, 
            result // Include the MongoDB result for debugging/client insight
        });

    } catch (error) {
        // Use next(error) for centralized error handling
        console.error('Update error:', error);
        next(error); 
    }
};

// const deleteOneCourse = async (req, res) => {
//     //swagger.tags=['Hello World']
//     try {
//         const db = database.getDatabase();
//         const { id } = req.params;
//         const filter = { _id: new ObjectId(id) };
//         console.log('ObjectId:', filter);
//         console.log('req.params.id:', req.params.id);

//         if (!ObjectId.isValid(id)) {
//         return res.status(400).json({ error: 'Invalid ID format' });
//         }
//         const result = await db.collection('courses').deleteOne({ _id: new ObjectId(id) });
//         if (result.deletedCount === 0) {
//         return res.status(404).json({ message: 'No course found to delete.' });
//         }
//         res.json({ message: 'Course deleted successfully.' });
//     } catch (err) {
//         console.error('Delete error:', err);
//         res.status(500).json({ error: 'Internal Server Error!' });
//     }
// };
const deleteOneCourse = async (req, res, next) => {
    /* * NOTE: Swagger tags and description should be in the router file, 
     * not inside the controller function, or provided via JSDoc above.
     */
    
    try {
        // 1. AUTHENTICATION (Handled by middleware, but check ensures req.user exists)
        if (!req.user) {
            // Should be caught by isAuthenticated middleware, but this is a fail-safe
            return res.status(401).json({ error: 'Unauthorized', message: 'User must be logged in.' });
        }

        const db = database.getDatabase();
        const courseId = req.params.id;

        // 2. VALIDATION: Check if ID is a valid MongoDB ObjectId format
        if (!ObjectId.isValid(courseId)) {
            return res.status(400).json({ error: 'Invalid ID format', message: 'Course ID is not a valid ObjectId.' });
        }

        const filter = { 
            _id: new ObjectId(courseId), 
            // 3. AUTHORIZATION: Ensure the logged-in user owns this course
            userId: req.user._id // Assuming req.user._id is the MongoDB ObjectId of the current user
        };

        const result = await db.collection('courses').deleteOne(filter);

        if (result.deletedCount === 0) {
            // If the count is 0, it means EITHER the course wasn't found (404) 
            // OR the user didn't own it (403 Forbidden). 
            // We default to 404 for security/simplicity in this check.
            const checkCourseExists = await db.collection('courses').findOne({ _id: new ObjectId(courseId) });
            
            if (checkCourseExists) {
                 // Course exists but user doesn't own it
                 return res.status(403).json({ message: 'Forbidden: You can only delete your own courses.' });
            }
            
            return res.status(404).json({ message: 'No course found to delete.' });
        }
        
        // Success
        res.status(200).json({ message: 'Course deleted successfully.' });

    } catch (err) {
        // Pass the error to the centralized Express error handler
        console.error('Delete course error:', err);
        next(err); 
    }
};

module.exports = { getAllCourses, getOneCourse, insertOneCourse, updateCourses, deleteOneCourse }
// import { ObjectId } from 'mongodb';
// import database from '../data/database.js'

// const getAllCourses = async (req, res) => {
//     try {
//         const db = database.getDatabase()
//         const courses = await db.collection('courses').find().toArray()
//         if (!courses) {
//             return res.status(404).json({
//                 message: "No Courses Found!"
//             })
//         }
//         res.status(200).json(courses)
//     } catch (err) {
//         res.status(500).json({
//             message: err.message
//         })
//     }
// }
// const getOneCourse = async (req, res) => {
//     try {
//         if (!ObjectId.isValid(req.params.id)) {
//             return res.status(400).json({message: "Invalid Format!"})
//         }
//         const courseId = ObjectId.createFromHexString(req.params.id);
//         const db = database.getDatabase()
//         const courses = await db.collection('courses').findOne({_id: courseId})
//         if (!courses) {
//             return res.status(404).json({
//                 message: "No Courses Found!"
//             })
//         }
//         res.status(200).json(courses)
//     } catch (err) {
//         res.status(500).json({
//             message: err.message
//         })
//     }
// }

// const insertOneCourse = async (req, res) => {
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
//         res.status(201).json({
//             message: "Course created successfully",
//             course_id: `${result.insertedId}`
//         })
//     }).catch(err => {
//         res.status(500).json({
//             message: err.message
//         })
//     })
    
// }
// const updateCourses = async (req, res) => {
//     try {
//         const db = database.getDatabase();
//         const { id } = req.params;
//         if (!ObjectId.isValid(id)) {
//             return res.status(400).json({ error: 'Invalid ID format'});
//         }
//         //  Validate body
//         console.log('Incoming update body:', req.body); // Debug log
//         if (!req.body || Object.keys(req.body).length === 0) {
//           return res.status(400).json({ error: 'Update data cannot be empty' });
//         }

//         // Converts the string id you received (e.g., from a URL parameter) 
//         // into a MongoDB ObjectId instance so MongoDB can match it.
//         const filter = { 
//             _id: new ObjectId(id)
//         };

//         // Without $set, if you passed req.body directly:
//         // MongoDB would replace the entire document with only the fields in 
//         // req.body, deleting any others not listed. $set avoids that by 
//         // performing a partial update.
//         const updateDoc = { $set: req.body };
//         let course = ''
//         const result = await db.collection('courses').updateOne(filter, updateDoc);
//         if (result.matchedCount === 0) {
//             return res.status(404).json({
//                 message: 'No matching student found.'
//             });
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

// const deleteOneCourse = async (req, res) => {
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



// Import database connection module (ESM syntax)
import mongodb from '../data/database.js';

// Import ObjectId from MongoDB for handling document IDs (ESM syntax)
import { ObjectId } from 'mongodb';

// ======================= GET ALL COURSES =======================
const getAllCourses = async (req, res) => {
    //#swagger.tags = ['Courses']
    try {
        // Fetch all courses documents from the 'courses' collection
        const result = await mongodb.getDatabase().collection('courses').find();
        // Convert MongoDB cursor to an array
        const courses = await result.toArray();
        
        // If no course found, return 404
        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: 'No courses found!' });
        }
        
        // Return the courses in JSON format
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(courses);
    } catch (error) {
        // Handle any unexpected server errors
        res.status(500).json({message: error.message || 'Some error occurred while retrieving the courses.'});
    }
}; 
// ======================= GET COURSE BY ID =======================
const getOneCourse = async (req, res) => {
    //#swagger.tags = ['Courses']
    try {
        // Convert the ID from the URL to a MongoDB ObjectId
        const courseId = new ObjectId(req.params.id);
        // Find the courses document with the matching ID
        const result = await mongodb.getDatabase().collection('courses').find({ _id: courseId });
        const courses = await result.toArray();
        
        // If courses not found, return 404
        if (!courses || courses.length === 0) {
            return res.status(404).json({
                message: `Courses with ID ${req.params.id} not found`
            });
        }
        
        // Return the single course object
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(courses[0]);
    } catch (error) {
        // Handle errors such as invalid ID or server issues
        res.status(500).json({message:error || 'Some error occurred while retrieving the course.'});
    }  
};

// ======================= CREATE COURSES =======================
const insertOneCourse = async (req, res) => {
    //#swagger.tags = ['Courses']
    try {
        // Create new course object from request body
        const updateEnrolment = {
            course_name: req.body.course_name,
            description: req.body.description,
            credits: req.body.credits,
            department: req.body.department,
            course: req.body.course,
            instructor: req.body.instructor,
            semester: req.body.semester
        }
        
        // Insert new course into MongoDB collection
        const result = await mongodb.getDatabase().collection('courses').insertOne(updateEnrolment);
        
        // Confirm successful insertion
        if (result.acknowledged) {
            res.status(201).json({
                message: 'Course created successfully',
                contactId: result.insertedId
            });
        } else {
            // Insertion failed for some reason
            res.status(500).json({ 
                message: 'Failed to create courses'
            });
        }
    } catch (error) {
        // Log and return server error
        console.error('Error creating courses:', error);
        res.status(500).json({ message:error || 'Some error occurred while creating the course.' });
    }
};
// ======================= UPDATE A COURSE =======================
const updateCourses = async (req, res) => {
    //#swagger.tags = ['Courses']
    try {
        // Validate ID format before proceeding
        if (!req.params.id || !ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid course ID format'
            });
        }
        
        // Convert ID to ObjectId and prepare update data
        const courseId = new ObjectId(req.params.id);
        const updateCourses = {
            course_name: req.body.course_name,
            description: req.body.description,
            credits: req.body.credits,
            department: req.body.department,
            course: req.body.course,
            instructor: req.body.instructor,
            semester: req.body.semester
        }
        
        // Update Course document by ID
        const result = await mongodb.getDatabase().collection('courses').updateOne(
            { _id: courseId }, 
            { $set: updateCourses }
        );
        
        // Handle cases where no matching Course found
        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: `Course with ID ${req.params.id} not found`
            });
        }
        
        // Return success message depending on update result
        if (result.modifiedCount > 0) {
            res.status(200).json({
                message: 'Course updated successfully'
            });
        } else {
            res.status(200).json({
                message: 'No changes made to the Course'
            });
        }
    } catch (error) {
        // Log and handle any update errors
        console.error('Error updating Course:', error);
        res.status(500).json({ message:error || 'Some error occurred while updating the Course.' });
    }
};
// ======================= DELETE A COURSE =======================
const deleteOneCourse = async (req, res) => {
    //#swagger.tags = ['Courses']
    try {
        // Validate ID format
        if (!req.params.id || !ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid course ID format'
            });
        }
        
        // Convert ID to ObjectId and delete course by ID
        const courseId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().collection('courses').deleteOne({ _id: courseId });
        
        // If no document deleted, actor doesn't exist
        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: `Course with ID ${req.params.id} not found`
            });
        }
        
        // Success response
        res.status(200).json({
            message: 'Course deleted successfully'
        });
    } catch (error) {
        // Log and handle deletion errors
        console.error('Error deleting actor:', error);
        res.status(500).json({ message: error || 'Some error occurred while deleting the course.' });
    }
};
export default { getAllCourses, getOneCourse, insertOneCourse, updateCourses, deleteOneCourse }
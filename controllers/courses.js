// Import database connection module (ESM syntax)
import mongodb from '../data/database.js';
// Import ObjectId from MongoDB for handling document IDs (ESM syntax)
import { ObjectId } from 'mongodb';

// ======================= GET ALL COURSES =======================
const getAllCourses = async (req, res) => {
    //#swagger.tags = ['All Courses']
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
        console.error('Error fetching courses:', error);
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
        // const updateEnrolment = {
        //     course_name: req.body.course_name,
        //     description: req.body.description,
        //     credits: req.body.credits,
        //     department: req.body.department,
        //     course: req.body.course,
        //     instructor: req.body.instructor,
        //     semester: req.body.semester
        // }
        console.log("Incoming data:", req.body);
        const db = mongodb.getDatabase();
        const course = req.body;
        if (!course.course_name || !course.instructor || !course.credits || !course.department) {
            return res.status(400).json({ 
                message: 'Missing required fields: course_name, instructor, credits, or department' 
            });
        }
        // Insert new course into MongoDB collection
        const result = await db.collection('courses').insertOne(course);
        
        // Confirm successful insertion
        res.status(201).json({
            message: 'Course created successfully',
            contactId: result.insertedId
        });
    } catch (error) {
        // Log and return server error
        console.error('Error creating course:', error);
        res.status(500).json({ message:error || 'Some error occurred while creating the course.' });
    }
};
// ======================= UPDATE A COURSE =======================
const updateCourses = async (req, res) => {
    //#swagger.tags = ['Courses']
    try {
        const courseId = req.params.id;
        // Validate ID format before proceeding
        if (!ObjectId.isValid(courseId)) {
            return res.status(400).json({
                message: 'Invalid course ID format'
            });
        }
        
        // Convert ID to ObjectId and prepare update data
        // const courseId = new ObjectId(req.params.id);
        // const updateCourses = {
        //     course_name: req.body.course_name,
        //     description: req.body.description,
        //     credits: req.body.credits,
        //     department: req.body.department,
        //     course: req.body.course,
        //     instructor: req.body.instructor,
        //     semester: req.body.semester
        // }
        const updateCourse = req.body;
        const db = mongodb.getDatabase();
        // Update Course document by ID
        const result = await db.collection('courses').updateOne(
            { _id: new ObjectId(courseId) }, 
            { $set: updateCourse }
        );
        // Handle cases where no matching Course found
        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: `Course with ID ${req.params.id} not found`
            });
        }
        
        // Return success message depending on update result
        if (result.modifiedCount > 0) {
            res.status(200).json({ message: 'No changes made to the Course'});
        }
        res.status(200).json({
            message: 'Course updated successfully'
        });
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
        const courseId = req.params.id;
        if (!ObjectId.isValid(courseId)) {
            return res.status(400).json({
                message: 'Invalid Course ID format'
            });
        }
        
        // Convert ID to ObjectId and delete student by ID
        const db = mongodb.getDatabase()
        const result = await db.collection('courses').deleteOne({ _id: new ObjectId(courseId)  });
                
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
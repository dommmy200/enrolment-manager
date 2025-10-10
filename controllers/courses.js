// Import database connection module (ESM syntax)
import mongodb from '../data/database.js';
// Import ObjectId from MongoDB for handling document IDs (ESM syntax)
import { ObjectId } from 'mongodb';

// ======================= GET ALL COURSES =======================
const getAllCourses = async (req, res) => {
    //#swagger.tags = ['Courses']
    //#swagger.description = 'Retrieve all courses available in the system'
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
    //#swagger.description = 'Retrieve a specific course by ID'
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
/*
    #swagger.tags = ['Courses']
    #swagger.description = 'Add a new Course to the catalog'
    #swagger.consumes = ['application/json']
    #swagger.produces = ['application/json']
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Course data to add',
      required: true,
      schema: {
        example: {
          course_name: "Introductory to Sciences",
          description: "Covers basics of General Sciences.",
          department: "General Sciences",
          semester: "Spring 2025",
          credit: 3,
          instructor_id: "68d87eb28b3ef5ea611c0099",
          status: "Active"
        }
      }
    }
    #swagger.responses[201] = {
      description: 'Course created successfully'
    }
    #swagger.responses[200] = swaggerTemplates.responses.success[200]
    #swagger.responses[400] = swaggerTemplates.responses.error[400]
    #swagger.responses[404] = swaggerTemplates.responses.error[404]
    #swagger.responses[500] = swaggerTemplates.responses.error[500]
  */
    try {
        console.log("Incoming data:", req.body);
        const db = mongodb.getDatabase();
        const course = req.body;
        if (!course.course_name || !course.description || !course.credits || !course.semester) {
            return res.status(400).json({ 
                message: 'Missing required fields: course_name, description, credits or semester' 
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
/*
    #swagger.tags = ['Courses']
    #swagger.description = 'Update an existing Course'
    #swagger.consumes = ['application/json']
    #swagger.produces = ['application/json']
    #swagger.parameters['id'] = { in: 'path', description: 'Course ID', required: true }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Updated Course data',
      required: true,
      schema: {
        example: {
          course_name: "Introductory to Sciences",
          description: "Covers basics of General Sciences.",
          department: "General Sciences",
          semester: "Spring 2025",
          credit: 3,
          instructor_id: "68d87eb28b3ef5ea611c0099",
          status: "Active"
        }
      }
    }
    #swagger.responses[200] = swaggerTemplates.responses.success[200]
    #swagger.responses[400] = swaggerTemplates.responses.error[400]
    #swagger.responses[404] = swaggerTemplates.responses.error[404]
    #swagger.responses[500] = swaggerTemplates.responses.error[500]
  */
    try {
        const courseId = req.params.id;
        // Validate ID format before proceeding
        if (!ObjectId.isValid(courseId)) {
            return res.status(400).json({
                message: 'Invalid course ID format'
            });
        }
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
        if (result.modifiedCount === 0) {
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
    //#swagger.description = 'Delete a course by ID'
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
import { ObjectId } from 'mongodb';
import database from '../data/database.js'

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

const insertOneCourse = async (req, res) => {
    //swagger.tags=['Hello World']
    const db = database.getDatabase()
    const updateEnrolment = {
        course_name: req.body.course_name,
        description: req.body.description,
        credits: req.body.credits,
        department: req.body.department,
        course: req.body.course,
        instructor: req.body.instructor,
        semester: req.body.semester
    }
    await db.collection('courses').insertOne(updateEnrolment).then(result =>{
        res.status(201).json(result)
    }).catch(err => {
        res.status(500).json({
            message: err.message
        })
    })
    
}
const updateCourses = async (req, res) => {
    //swagger.tags=['Hello World']
    try {
        const db = database.getDatabase();
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID format'});
        }
        //  Validate body
        console.log('Incoming update body:', req.body); // Debug log
        if (!req.body || Object.keys(req.body).length === 0) {
          return res.status(400).json({ error: 'Update data cannot be empty' });
        }

        // Converts the string id you received (e.g., from a URL parameter) 
        // into a MongoDB ObjectId instance so MongoDB can match it.
        const filter = { 
            _id: new ObjectId(id)
        };

        // Without $set, if you passed req.body directly:
        // MongoDB would replace the entire document with only the fields in 
        // req.body, deleting any others not listed. $set avoids that by 
        // performing a partial update.
        const updateDoc = { $set: req.body };
        let course = ''
        const result = await db.collection('courses').updateOne(filter, updateDoc);
        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: 'No matching student found.'
            });
        }
        if (result.matchedCount === 1) {
            course = 'course'
        } else if (result.matchedCount > 1){
            course = 'courses'
        }

        res.status(200).json({
            message: `Updated ${result.modifiedCount} ${course}.`, result
        });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({
            error: `Internal Server Error!`
        });
    }
    
};

const deleteOneCourse = async (req, res) => {
    //swagger.tags=['Hello World']
    try {
        const db = database.getDatabase();
        const { id } = req.params;
        const filter = { _id: new ObjectId(id) };
        console.log('ObjectId:', filter);
        console.log('req.params.id:', req.params.id);

        if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
        }
        const result = await db.collection('courses').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'No course found to delete.' });
        }
        res.json({ message: 'Course deleted successfully.' });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).json({ error: 'Internal Server Error!' });
    }
};

export default { getAllCourses, getOneCourse, insertOneCourse, updateCourses, deleteOneCourse }
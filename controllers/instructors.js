const mongodb = require('mongodb')
const database = require('../data/database')
const { ObjectId } = require('mongodb')

const getAllInstructors = async (req, res) => {
    //swagger.tags=['Hello World']
    try {
        const db = database.getDatabase()
        const instructors = await db.collection('instructors').find().toArray()
        if (!instructors) {
            return res.status(404).json({
                message: "No Instructors Found!"
            })
        }
        res.status(200).json(instructors)
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}
const getOneInstructor = async (req, res) => {
    //swagger.tags=['Hello World']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({message: "Invalid Format!"})
        }
        const instructorId = ObjectId.createFromHexString(req.params.id);
        const db = database.getDatabase()
        const instructor = await db.collection('instructors').findOne({_id: instructorId})
        if (!instructor) {
            return res.status(404).json({
                message: "No Instructors Found!"
            })
        }
        res.status(200).json(instructor)
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

const insertOneInstructor = async (req, res) => {
    //swagger.tags=['Hello World']
    const db = database.getDatabase()
    const updateEnrolment = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        course: req.body.course,
        department: req.body.department,
        hire_date: req.body.hire_date,
        status: req.body.status
    }
    await db.collection('instructors').insertOne(updateEnrolment).then(result =>{
        res.status(201).json(result)
    }).catch(err => {
        res.status(500).json({
            message: err.message
        })
    })
    
}
const updateInstructors = async (req, res) => {
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
        let instructor = ''
        const result = await db.collection('instructors').updateOne(filter, updateDoc);
        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: 'No matching instructor found.'
            });
        }
        if (result.matchedCount === 1) {
            instructor = 'instructor'
        } else if (result.matchedCount > 1){
            instructor = 'instructors'
        }

        res.status(200).json({
            message: `Updated ${result.modifiedCount} ${instructor}.`, result
        });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({
            error: `Internal Server Error!`
        });
    }
    
};

const deleteOneInstructor = async (req, res) => {
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
        const result = await db.collection('instructors').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'No instructor found to delete.' });
        }
        res.json({ message: 'Instructors deleted successfully.' });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).json({ error: 'Internal Server Error!' });
    }
};

module.exports = { getAllInstructors, getOneInstructor, insertOneInstructor, updateInstructors, deleteOneInstructor }
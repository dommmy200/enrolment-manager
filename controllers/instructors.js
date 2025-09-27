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
        const instructorId = new ObjectId(req.params.id);
        const db = database.getDatabase()
        const instructor = await db.collection('instructors').findOne({_id: instructorId})
        console.log("list: ", instructor)
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

// const insertOneInstructor = async (req, res) => {
//     //swagger.tags=['Hello World']
//     const db = database.getDatabase()
//     const updateEnrolment = {
//         first_name: req.body.first_name,
//         last_name: req.body.last_name,
//         email: req.body.email,
//         phone_number: req.body.phone_number,
//         course: req.body.course,
//         department: req.body.department,
//         hire_date: req.body.hire_date,
//         status: req.body.status
//     }
//     await db.collection('instructors').insertOne(updateEnrolment).then(result =>{
//         res.status(201).json(result)
//     }).catch(err => {
//         res.status(500).json({
//             message: err.message
//         })
//     })
    
// }
const insertOneInstructor = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'Unauthorized', message: 'User must be logged in to create an instructor.' });
        }

        const db = database.getDatabase();
        
        const newInstructor = {
            // Map request body to Instructor schema fields
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone_number: req.body.phone_number,
            department_id: req.body.department_id,
            hire_date: req.body.hire_date,
            
            // OWNERSHIP LINK: Required for later update/delete checks
            userId: req.user._id 
        };

        // Basic check for required fields (can be replaced by Joi validation middleware)
        if (!newInstructor.first_name || !newInstructor.email || !newInstructor.department_id) {
             return res.status(400).json({ error: 'Validation Error', message: 'Missing required instructor fields.' });
        }

        const result = await db.collection('instructors').insertOne(newInstructor);
        
        res.status(201).json({ 
            message: 'Instructor created successfully.',
            insertedId: result.insertedId 
        });

    } catch (err) {
        console.error('Insert instructor error:', err);
        next(err); 
    }
}
// const updateInstructors = async (req, res) => {
//     //swagger.tags=['Hello World']
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
//         let instructor = ''
//         const result = await db.collection('instructors').updateOne(filter, updateDoc);
//         if (result.matchedCount === 0) {
//             return res.status(404).json({
//                 message: 'No matching instructor found.'
//             });
//         }
//         if (result.matchedCount === 1) {
//             instructor = 'instructor'
//         } else if (result.matchedCount > 1){
//             instructor = 'instructors'
//         }

//         res.status(200).json({
//             message: `Updated ${result.modifiedCount} ${instructor}.`, result
//         });
//     } catch (error) {
//         console.error('Update error:', error);
//         res.status(500).json({
//             error: `Internal Server Error!`
//         });
//     }
    
// };
const updateInstructors = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'Unauthorized', message: 'User must be logged in.' });
        }

        const db = database.getDatabase();
        const instructorId = req.params.id;
       
        if (!ObjectId.isValid(instructorId)) {
            return res.status(400).json({ error: 'Invalid ID format', message: 'Instructor ID is not a valid ObjectId.' });
        }
        
        if (!req.body || Object.keys(req.body).length === 0) {
          return res.status(400).json({ error: 'Update data cannot be empty' });
        }

        // AUTHORIZATION/FILTER: Match document by ID AND ownership
        const filter = { 
            _id: new ObjectId(instructorId), 
            userId: req.user._id 
        };

        // Use $set for partial update
        const updateDoc = { $set: req.body };

        const result = await db.collection('instructors').updateOne(filter, updateDoc);

        if (result.matchedCount === 0) {
            const checkExists = await db.collection('instructors').findOne({ _id: new ObjectId(instructorId) });
            
            if (checkExists) {
                 // Exists but not owned by current user
                 return res.status(403).json({ message: 'Forbidden: You can only update your own instructor records.' });
            }
            
            return res.status(404).json({ message: 'No instructor found to update.' });
        }
        
        res.status(200).json({
            message: `Instructor updated successfully. Modified count: ${result.modifiedCount}.`, 
            result
        });

    } catch (error) {
        console.error('Update instructor error:', error);
        next(error); 
    }
};

// const deleteOneInstructor = async (req, res) => {
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
//         const result = await db.collection('instructors').deleteOne({ _id: new ObjectId(id) });
//         if (result.deletedCount === 0) {
//         return res.status(404).json({ message: 'No instructor found to delete.' });
//         }
//         res.json({ message: 'Instructors deleted successfully.' });
//     } catch (err) {
//         console.error('Delete error:', err);
//         res.status(500).json({ error: 'Internal Server Error!' });
//     }
// };
const deleteOneInstructor = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'Unauthorized', message: 'User must be logged in.' });
        }

        const db = database.getDatabase();
        const instructorId = req.params.id;

        if (!ObjectId.isValid(instructorId)) {
            return res.status(400).json({ error: 'Invalid ID format', message: 'Instructor ID is not a valid ObjectId.' });
        }
        
        // AUTHORIZATION/FILTER: Match document by ID AND ownership
        const filter = { 
            _id: new ObjectId(instructorId), 
            userId: req.user._id 
        };

        const result = await db.collection('instructors').deleteOne(filter);

        if (result.deletedCount === 0) {
            const checkExists = await db.collection('instructors').findOne({ _id: new ObjectId(instructorId) });
            
            if (checkExists) {
                 // Exists but not owned by current user
                 return res.status(403).json({ message: 'Forbidden: You can only delete your own instructor records.' });
            }
            
            return res.status(404).json({ message: 'No instructor found to delete.' });
        }
        
        res.status(200).json({ message: 'Instructor deleted successfully.' });

    } catch (err) {
        console.error('Delete instructor error:', err);
        next(err); 
    }
};

module.exports = { getAllInstructors, getOneInstructor, insertOneInstructor, updateInstructors, deleteOneInstructor }
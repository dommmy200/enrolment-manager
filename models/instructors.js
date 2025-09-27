// In models/course.js
const instructorSchema = new Schema({
    title: String,
    code: String,
    // Link to the user who created this course
    userId: { type: Schema.Types.ObjectId, ref: 'user' } 
});
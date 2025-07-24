// attendance.model.js (MongoDB example)
const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    department: String, // e.g., "Computer Science"
    year: String,        // e.g., "1st"
    semester: String,    // e.g., "Sem 1"
    division: String,    // e.g., "A"
    subject: String,     // optional if period-wise
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teacher",
    },
    topicName: { type: String },
    students: [
        {
            studentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Student",
            },
            isPresent: {
                type: Boolean,
                required: true,
            },
        },
    ],
}, { timestamps: true });

const attendance = mongoose.models.attendance || mongoose.model('attendance', attendanceSchema);

export default attendance;

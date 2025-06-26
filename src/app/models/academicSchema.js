import mongoose from 'mongoose';

const academicSchema = new mongoose.Schema({    // e.g., "2025-2026"
    year: {
        type: String,
        required: true
    },               // e.g., "Second Year"

    // Common subjects for all divisions
    subjects: [
        {
            name: { type: String, required: true },
            code: { type: String, required: true, unique: true }
        }
    ],

    // Multiple divisions
    divisions: [
        {
            name: {
                type: String,
                required: true
            },  // e.g., "A", "B"
            classTeacher: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
        }
    ],

    timetable:
    {
        divisionName: {
            type: String,
            //required: true
        },
        days: [{
            type: String,
            //required: true
        }],   // e.g., "Monday"
        slots: [
            {
                time: {
                    type: String,
                    //required: true
                },        // e.g., "10:00 - 11:00"
                subjectCode: {
                    type: String,
                    //required: true
                }, // references subject.code
                teacher: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    //required: true
                }
            }
        ]
    },

    //assignment from teacher

    assignments: [
        {
            title: String,
            description: String,
            subjectCode: String,
            //teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            dueDate: Date,
            fileUrl: String,
            createdAt: { type: Date, default: Date.now }
        }
    ],

    //attendance from teacher

    attendanceRecords: [
        {
            date: { type: Date, 
                //required: true 

            },
            subjectCode: { type: String, //required: true 
            },
            students: [
                {
                    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                    present: Boolean
                }
            ]
        }
    ],




    exams: [
        {
            subjectCode: String,
            examType: String, // e.g., "Midterm"
            examDate: Date,
            totalMarks: Number,
            marks: [
                {
                    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                    marksObtained: Number
                }
            ]
        }
    ]
});

const academic = mongoose.models.academic || mongoose.model("academic", academicSchema);

export default academic;
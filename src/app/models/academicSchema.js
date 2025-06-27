// models/academicSchema.js

import mongoose from 'mongoose';

const academicSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true, // e.g. "2nd Year"
  },
  divisions: [
    {
      name: {
        type: String, // A, B, C
        required: true,
      },
      subjects: [
        {
          name: { type: String, required: true }, // e.g. OOPs, CNS
          teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'teacher', 
            required: true,
          },
        },
      ],
      timetable: [
        {
          day: { type: String, required: true }, // Monday, Tuesday...
          period: { type: String, required: true }, // Period 1, 2...
          subject: { type: String, required: true },
          teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          time: {
            start: { type: String }, // "10:00"
            end: { type: String },   // "10:45"
          },
        },
      ],
      exams: [
        {
          type: { type: String, required: true }, // Unit Test, Mid Term, etc.
          subject: { type: String, required: true },
          totalMarks: { type: Number, required: true },
          date: { type: Date, required: true },
        },
      ],
      attendance: [
        {
          student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // assuming student is stored in 'User' model
            required: true,
          },
          subject: { type: String, required: true },
          date: { type: Date, required: true },
          status: { type: String, enum: ['Present', 'Absent'], required: true },
          recordedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // recorded by teacher
            required: true,
          },
        },
      ],
    },
  ],
});

export default mongoose.models.Academic ||
  mongoose.model('Academic', academicSchema);

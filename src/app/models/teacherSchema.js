// models/teacherSchema.js

import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  teacherId: {
    type: String,
    required: true,
    unique: true,
  },
  subjects: [{
    name: String, 
    code:String
  }],
  assignedDivisions: [{
    year: String,
    division: String
  }],
  timetable: [{
    day: String, // e.g., 'Monday'
    period: Number,
    subject: String,
    division: String
  }],
  dateOfJoining: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: 'Teacher'
  }
});

const teacher = mongoose.models.teacher|| mongoose.model('teacher', teacherSchema);

export default teacher;
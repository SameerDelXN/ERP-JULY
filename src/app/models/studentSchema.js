//database schema for student

import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
    },
    admissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admission',
      required: true,
      unique: true,
    },
    fullName: { type: String },
    email: { type: String },
    mobileNumber: { type: String },
    dateOfBirth: { type: Date },
    address: {
      addressLine: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'alumni', 'suspended'],
      default: 'active',
    },
  },
  { timestamps: true }
);

delete mongoose.models.student

const student = mongoose.models.student || mongoose.model('student', studentSchema);

export default student;


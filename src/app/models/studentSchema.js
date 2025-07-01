// //database schema for student

// import mongoose from 'mongoose';

// const studentSchema = new mongoose.Schema(
//   {
//     // Custom unique student identifier (e.g., SCH2025-001)
//     studentId: {
//       type: String,
//       required: true,
//       unique: true, // Ensures no duplicate student IDs
//     },

//     // Link to admission form
//     admissionId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'admission',
//       required: true,
//       unique: true, // One student per admission
//     },

//     // Optional status for tracking
//     status: {
//       type: String,
//       enum: ['active', 'inactive', 'alumni', 'suspended'],
//       default: 'active',
//     },
//   },
//   {
//     timestamps: true, // Automatically manages createdAt, updatedAt
//   }
// );

// const student = mongoose.models.student || mongoose.model('student', studentSchema);

// export default student;

import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  dteApplicationNumber: { type: String, required: true, unique: true },
  admissionYear: { type: String, required: true }, // e.g., "2024-25"
  email: { type: String, required: true, lowercase: true },

  // Full Name Details
  fullNameAsPerLastExam: { type: String, required: true },
  nameAsPerAadhar: { type: String, required: true },
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },

  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true
  },

  // Academic Information
  programType: {
    type: String,
    enum: ["Diploma", "UG", "PG"],
    required: true
  },
  year: {
    type: String,
    enum: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    required: true
  },
  branch: { type: String, required: true },
  shift: {
    type: String,
    enum: ["First", "Second"],
    required: true
  },
  round: {
    type: String,
    enum: ["CAP1", "CAP2", "CAP3", "Institute Level"],
    required: true
  },
  quota: {
    type: String,
    enum: [
      "General", "OBC", "SC", "ST", "VJ", "NT1", "NT2", "NT3", "SBC", "EWS"
    ],
    required: true
  },
  seatType: {
    type: String,
    enum: ["GOV", "MIN", "Management", "TFWS"],
    required: true
  },
  admissionCategoryDTE: {
    type: String,
    enum: ["CAP", "Institute Level", "Against CAP"],
    required: true
  },
  feesCategory: {
    type: String,
    enum: ["Open", "OBC", "SC", "ST", "TFWS", "EWS"],
    required: true
  },
  admissionType: {
    type: String,
    enum: ["Fresh", "Lateral Entry", "Transfer", "Direct Second Year"],
    required: true
  },

  // Caste & Category Details
  casteAsPerLC: { type: String, required: true },
  subCasteAsPerLC: { type: String },
  domicile: {
    type: String,
    enum: ["Maharashtra", "Other State"],
    required: true
  },
  nationality: {
    type: String,
    enum: ["Indian", "Foreign"],
    required: true
  },
  religionAsPerLC: { type: String },

  // Personal Information
  dateOfBirth: { type: Date, required: true },
  motherName: { type: String, required: true },
  familyIncome: { type: Number },

  studentWhatsappNo: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/
  },
  fatherWhatsappNo: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/
  },
  motherMobileNo: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/
  },

  isForeignNational: { type: Boolean, default: false },

  // System-generated
  zprn: { type: String, unique: true, sparse: true },
  isZprnGenerated: { type: Boolean, default: false }

}, { timestamps: true }); // auto manages createdAt, updatedAt

export default mongoose.models.Student || mongoose.model("Student", studentSchema);

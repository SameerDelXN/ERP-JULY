import mongoose from "mongoose";

const coursePlanSchema = new mongoose.Schema({
    academicRef: {  // Reference to the academic document
    type: mongoose.Schema.Types.ObjectId,
    ref: "academic",
    required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subject",
    required: true,
  },
  branch: { type: String, required: true },
  year: { type: String, required: true },
  division: { type: String, default: "-" },
  batch: { type: String, default: "-" },
  loadType: { type: String, required: true },
  syllabus: { type: String },
  coursePlan: { type: String },
  schedule: { type: String },
  execute: { type: Boolean, default: false },
  report: { type: String }, 
  summaryReport: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports =
  mongoose.models.CoursePlan || mongoose.model("CoursePlan", coursePlanSchema);

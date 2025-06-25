import mongoose from 'mongoose';

const admissionSchema = new mongoose.Schema({

  enquiryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'enquiry',
  },

  // 1. Basic Details
  first: {
    type: String,
    required: true
  },
  middle: String,
  last: {
    type: String,
    required: true
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  nationality: String,

  // 2. Contact Details
  fatherName: String,
  motherName: String,
  parentMobile: String,
  parentEmail: String,

  // 3. Address Details
  addressLine: String,
  city: String,
  state: String,
  pincode: String,
  country: String,

  // 4. Academic Interest
  currentSchoolName: {
    type: String,
    // required: true
  },
  currentClass: {
    type: String,
    // required: true
  },
  applyingForClass: {
    type: String,
    // required: true
  },
  academicYear: {
    type: String,
    // required: true
  },
  preferredMedium: {
    type: String,
    enum: ['English', 'Hindi', 'Other'],
    // required: true
  },

  // 5. Documents
  documents: {
    birthCertificate: {
      fileName: String,
      fileUrl: String,
      mimeType: String,
    },
    parentIdProof: {
      fileName: String,
      fileUrl: String,
      mimeType: String,
    }
  },

  // 6. Consent & Verification
  consent: {
    type: Boolean,
    // required: true
  },
  captchaVerified: {
    type: Boolean,
    // required: true
  },

}, { timestamps: true });
delete mongoose.models.Admission
const admission = mongoose.models.Admission || mongoose.model('Admission', admissionSchema);

export default admission;
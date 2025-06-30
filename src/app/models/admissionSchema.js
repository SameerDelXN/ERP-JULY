//database schema for admission form 
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
  currentSchoolName: String,
  currentClass: String,
  applyingForClass: String,
  academicYear: String,
  preferredMedium: {
    type: String,
    enum: ['English', 'Hindi', 'Other'],
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
  consent: Boolean,
  captchaVerified: Boolean,

  // 7. Status Field
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  }

}, { timestamps: true });

delete mongoose.models.admission;
const admission = mongoose.models.admission || mongoose.model('admission', admissionSchema);

export default admission;

//database schema for admission form 
import mongoose from 'mongoose';

const admissionSchema = new mongoose.Schema({
  enquiryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'enquiry',
    required: true
  },
  counsellorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // optional: reference to a User model
    required: true

  },

  //personal details
  fullName: { type: String, required: true }, // As per last mark sheet (CAPITAL)
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  nationality: { type: String, required: true },
  category: {
    type: String,
    enum: ['Open', 'SC', 'ST', 'OBC', 'EWS', 'NT', 'SBC', 'VJ', 'Other'],
    required: true
  },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },

  //parent details
  fatherName: { type: String },
  motherName: { type: String },
  guardianName: { type: String },
  parentContact: { type: String },
  parentEmail: { type: String },
  familyIncome: { type: Number },

  // 3. Address Details permanent and present
  addressLine: String,
  city: String,
  state: String,
  pincode: String,
  country: String,


  // Academic Information
  programType: {
    type: String,
    enum: ["Diploma", "UG", "PG"],
    required: true
  },
  courseName: { type: String, required: true }, // Name of the course admitted
  yearOfAdmission: {
    type: String,
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    required: true
  },
  round: {
    type: String,
    enum: ["CAP1", "CAP2", "CAP3", "Institute Level"],
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

  casteAsPerLC: { type: String, required: true },
  subCasteAsPerLC: { type: String },
  domicile: { type: String, required: true },
  religionAsPerLC: { type: String },

  // 4. Academic Interest
  // currentSchoolName: String,
  // currentClass: String,
  // applyingFor: String,
  // academicYear: String,


  qualifyingExam: { type: String, required: true }, // e.g., HSC, Graduation
  marksObtained: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  percentage: { type: Number, required: true },
  grade: { type: String },
  monthYearOfPassing: { type: String }, // e.g., "Mar 2023"


  // Documents (URLs or file names)
  photograph: { type: String },
  signature: { type: String },
  markSheets: [{ type: String }], // array of file URLs/names
  transferCertificate: { type: String },
  migrationCertificate: { type: String },
  undertakingDocument: { type: String },


  // 5. Documents
  documents: [
    {
      type: {
        type: String, // e.g., "birthCertificate", "parentIdProof"
        required: true,
      },
      fileName: {
        type: String,
        required: true,
      },
      fileUrl: {
        type: String,
        required: true,
      },
      mimeType: {
        type: String,
        required: true,
      }
    }
  ],

  // System-generated
  prn: { type: String, unique: true, sparse: true }, // ZPRN (can be generated after form is filled)
  isprnGenerated: { type: Boolean, default: false },

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

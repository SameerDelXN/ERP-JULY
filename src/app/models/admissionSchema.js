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
  fullName: { type: String, }, // As per last mark sheet (CAPITAL)
  dateOfBirth: { type: Date, },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  nationality: { type: String, },
  category: {
    type: String,
    enum: ['Open', 'SC', 'ST', 'OBC', 'EWS', 'NT', 'SBC', 'VJ', 'Other'],
    default:null
  },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },

  //parent details
  fatherName: { type: String,default:null },
  motherName: { type: String,default:null },
  guardianName: { type: String,default:null },
  parentMobile: { type: String,default:null },
  parentEmail: { type: String,default:null },
  familyIncome: { type: Number,default:null },

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
    default:null
  },
  courseName: { type: String, required: true }, // Name of the course admitted
  yearOfAdmission: {
    type: String,
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    default:null
  },
  round: {
    type: String,
    enum: ["CAP1", "CAP2", "CAP3", "Institute Level"],
    default:null
  },

  seatType: {
    type: String,
    enum: ["GOV", "MIN", "Management", "TFWS"],
    default:null
  },
  admissionCategoryDTE: {
    type: String,
    enum: ["CAP", "Institute Level", "Against CAP"],
    default:null
  },

  casteAsPerLC: { type: String,default:null},
  subCasteAsPerLC: { type: String,default:null },
  domicile: { type: String,default:null },
  religionAsPerLC: { type: String,default:null },

  // 4. Academic Interest
  // currentSchoolName: String,
  // currentClass: String,
  // applyingFor: String,
  // academicYear: String,


  qualifyingExam: { type: String,default:null }, // e.g., HSC, Graduation
  marksObtained: { type: Number,default:null },
  totalMarks: { type: Number, default:null },
  percentage: { type: Number, default:null },
  grade: { type: String,default:null },
  monthYearOfPassing: { type: String,default:null }, // e.g., "Mar 2023"


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
      },
      fileName: {
        type: String,
      },
      fileUrl: {
        type: String,
      },
      mimeType: {
        type: String,
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
    enum: ['inProcess', 'approved', 'rejected'],
    default: 'inProcess',
  }

}, { timestamps: true });

delete mongoose.models.admission;
const admission = mongoose.models.admission || mongoose.model('admission', admissionSchema);

export default admission;

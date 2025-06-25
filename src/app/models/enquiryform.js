import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
    // 1. Basic Details
    first: { 
        type: String, 
        required: true },
    middle: String,
    last: { 
        type: String, 
        required: true },
    dateOfBirth: Date,
    gender: { 
        type: String, 
        enum: ['Male', 'Female', 'Other'] 
    },
    nationality:String,

     // 2. Parent/Guardian Info
    fatherName: String,
    motherName: String,
    parentMobile: String,
    parentEmail: String,

     //3.contact details
    mobile: { 
        type: String, 
        required: true 
    },
    alternateNumber: String,
    email: String,
    preferredContactMethod: {
        type: String,
        enum: ['Call', 'SMS', 'Email', 'WhatsApp']
    },
    // 4. Address Details
    addressLine: String,
    city: String,
    state: String,
    pincode: String,
    country: String,

    // 5. Academic Interest
    CurrentSchoolName:String,
    CurrentClass:String,
    ApplyingForClass:String,
    AcademicYearApplyingFor:String,
    PreferredMediumofInstruction:{
        type: String,
        enum: ['Hindi', 'English', 'Other']
    }, 

    // 6. document uploads
    birthCertificateUrl: { 
        type: String, 
        required: true 
    },  // URL or path
    parentIdProofUrl: { 
        type: String, 
        required: true 
    },

    // documents: [{
    //     name: String, // e.g. "Transfer Certificate"
    //     type: String, // e.g. "PDF", "Image"
    //     url: String,  // file URL or Google Drive link
    //     uploadedAt: {
    //         type: Date,
    //         default: Date.now
    //     }
    //}],

    // 7. consent
    agreedToTerms: { type: Boolean, required: true },
    captchaVerified: { type: Boolean, required: true }
   
}, { timestamps: true });

export default mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema);
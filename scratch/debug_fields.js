const mongoose = require('mongoose');

async function debugFields() {
  const studentId = '69ff5e73678e80d8866a443d';
  const MONGODB_URI = "mongodb+srv://delxn:delxn@cluster0.9huz0ct.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 
  
  try {
    await mongoose.connect(MONGODB_URI);
    const Admission = mongoose.models.admission || mongoose.model('admission', new mongoose.Schema({}, { strict: false }), 'admissions');
    const student = await Admission.findById(studentId);
    
    console.log('--- All Keys in Admission Document ---');
    console.log(Object.keys(student.toObject()));
    console.log('\n--- Specific Values ---');
    console.log('year:', student.year);
    console.log('admissionYear:', student.admissionYear);
    console.log('academicYear:', student.academicYear);
    console.log('currentYear:', student.currentYear);
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
debugFields();

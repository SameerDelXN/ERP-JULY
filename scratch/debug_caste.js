const mongoose = require('mongoose');

async function debugCaste() {
  const MONGODB_URI = "mongodb+srv://delxn:delxn@cluster0.9huz0ct.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 
  await mongoose.connect(MONGODB_URI);
  console.log('Connected');

  const FeeStructure = mongoose.models.FeeStructure || mongoose.model('FeeStructure', new mongoose.Schema({}, { strict: false }), 'feestructures');

  const all = await FeeStructure.find({}).lean();
  console.log(`\n--- All ${all.length} Fee Structures ---`);
  all.forEach(f => {
    console.log(`ID: ${f._id} | Program: ${f.programType} | Dept: ${f.departmentName} | Year: ${f.year} | Caste: "${f.caste}" | Category: "${f.category}" | Scholarship: "${f.scholarshipParticular}" | TotalFees: ${f.totalFees}`);
  });
  
  process.exit(0);
}
debugCaste().catch(e => { console.error(e); process.exit(1); });

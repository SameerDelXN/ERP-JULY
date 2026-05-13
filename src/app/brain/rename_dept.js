const { connectToDatabase } = require('../lib/mongodb');
const academic = require('../models/academicSchema').default || require('../models/academicSchema');

async function run() {
  try {
    await connectToDatabase();
    const result = await academic.updateOne(
      { department: 'Computer Engineering', programType: 'UG' },
      { $set: { department: 'Computer Science' } }
    );
    console.log('Update result:', result);
    
    // Also check if there's any other "Computer Engineering" that should be "Computer Science" for UG
    // just in case it was created with a slightly different name
    const result2 = await academic.updateMany(
      { department: /Computer Eng/i, programType: 'UG' },
      { $set: { department: 'Computer Science' } }
    );
    console.log('UpdateMany result:', result2);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

run();

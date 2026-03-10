import { connectToDatabase } from '@/lib/mongoose';
import Student from '@/app/models/studentSchema';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const division = searchParams.get('division');
    const year = searchParams.get('year');
    const department = searchParams.get('department');
    
    // Build query based on filters
    let query = {};
    if (division) query.division = division;
    if (year) query.currentYear = year;
    if (department) query.branch = department; // Use branch field for department filtering
    
    const students = await Student.find(query).lean();
    
    const transformedStudents = students.map(student => ({
      _id: student._id,
      name: student.fullName,
      studentId: student.studentId,
      email: student.email,
      phone: student.mobileNumber,
      branch: student.branch || 'Not Assigned', // Fixed: Return as branch, not department
      department: student.branch || 'Not Assigned', // Keep for backward compatibility
      year: student.currentYear || 'Not Assigned',
      division: student.division || 'Not Assigned',
      feeStatus: student.totalFees > 0 ? 'Pending' : 'Paid',
      outstandingAmount: student.totalFees || 0,
      totalFees: student.totalFees || 0,
      feesCategory: student.feesCategory || 'General',
      address: student.address?.[0]?.addressLine ? `${student.address[0].addressLine}, ${student.address[0]?.city || ''}, ${student.address[0]?.state || ''}` : 'Not Provided',
      programType: student.programType,
      status: student.status,
      admissionYear: student.admissionYear,
      prn: student.prn
    }));
    
    return NextResponse.json({ success: true, data: transformedStudents }, { status: 200 });
    
  } catch (error) {
    console.error('[GET_STUDENTS_ERROR]', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

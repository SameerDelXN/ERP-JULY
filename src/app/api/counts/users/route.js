//GET route handler to fetch number of users
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import userSchema from '../../../models/userSchema';

export async function GET() {
  try {
    await connectToDatabase();

    const totalStudents = await userSchema.countDocuments({ role: 'student' });
    const totalStaff = await userSchema.countDocuments({ role: 'staff' });
    const totalTeachers = await userSchema.countDocuments({ role: 'teacher' });
    const totalHR = await userSchema.countDocuments({ role: 'hr' });

    const activeStudents = await userSchema.countDocuments({ role: 'student', isActive: true });
    const activeStaff = await userSchema.countDocuments({ role: 'staff', isActive: true });
    const activeTeachers = await userSchema.countDocuments({ role: 'teacher', isActive: true });
    const activeHR = await userSchema.countDocuments({ role: 'hr', isActive: true });

    return NextResponse.json({
      students: {
        total: totalStudents,
        active: activeStudents,
      },
      staff: {
        total: totalStaff,
        active: activeStaff,
      },
      teachers: {
        total: totalTeachers,
        active: activeTeachers,
      },
      hr: {
        total: totalHR,
        active: activeHR,
      }
    }, { status: 200 });

  } catch (error) {
    console.error('User count GET error:', error);
    return NextResponse.json({
      message: 'Server error',
      error: error.message
    }, { status: 500 });
  }
}

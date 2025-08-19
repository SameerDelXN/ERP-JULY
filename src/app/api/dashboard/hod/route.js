// src/app/api/dashboard/hod/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import Student from '@/app/models/studentSchema';
import Teacher from '@/app/models/teacherSchema';

export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const hodId = searchParams.get('hodId');
    const listType = searchParams.get('listType'); // 'students' or 'teachers'

    if (!hodId) {
      return NextResponse.json({ error: 'Missing HOD ID' }, { status: 400 });
    }

    const hodUser = await Teacher.findById(hodId);
    if (!hodUser || hodUser.role !== 'hod') {
      return NextResponse.json({ error: 'HOD not found or invalid role' }, { status: 404 });
    }

    const department = hodUser.department?.trim();

    if (!department) {
      return NextResponse.json({ error: 'HOD department is not set' }, { status: 400 });
    }

    if (listType) {
      if (listType === 'students') {
        const students = await Student.find({ branch: { $regex: new RegExp(`^${department}$`, 'i') } })
          .select('fullName email status studentId')
          .lean();

        return NextResponse.json(students);
      } else if (listType === 'teachers') {
        // Use case-insensitive exact match with regex and ignore null/empty department
        const teachers = await Teacher.find({
          department: { $regex: new RegExp(`^${department}$`, 'i') },
          role: 'teacher',
        })
          .select('teacherId fullName email phone')
          .lean();

        return NextResponse.json(teachers);
      }
    }

    // Default dashboard stats
    const totalStudents = await Student.countDocuments({
      branch: { $regex: new RegExp(`^${department}$`, 'i') },
    });

    const totalTeachers = await Teacher.countDocuments({
      department: { $regex: new RegExp(`^${department}$`, 'i') },
      role: 'teacher',
    });

    const activeStudents = await Student.countDocuments({
      branch: { $regex: new RegExp(`^${department}$`, 'i') },
      status: 'active',
    });

    const attendanceRate = 92.5; // Placeholder

    return NextResponse.json({
      department,
      totalStudents,
      totalTeachers,
      activeStudents,
      attendanceRate: parseFloat(attendanceRate.toFixed(2)),
    });
  } catch (error) {
    console.error('Error in HOD Dashboard API:', error);
    return NextResponse.json({ error: 'Failed to fetch HOD dashboard data' }, { status: 500 });
  }
}

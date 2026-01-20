import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import User from '@/app/models/userSchema';
import Student from '@/app/models/studentSchema';
import Teacher from '@/app/models/teacherSchema';

export async function GET() {
    try {
        await connectToDatabase();

        // Fetch from all collections
        const users = await User.find({}).select('fullName email role permissions staffId');
        const students = await Student.find({}).select('fullName email mobileNumber permissions studentId');
        const teachers = await Teacher.find({}).select('fullName email role department permissions teacherId');

        // Normalize data
        const normalizedUsers = users.map(u => ({
            _id: u._id,
            fullName: u.fullName,
            email: u.email,
            role: u.role,
            permissions: u.permissions || [],
            type: 'user',
            identifier: u.staffId || 'N/A'
        }));

        const normalizedStudents = students.map(s => ({
            _id: s._id,
            fullName: s.fullName,
            email: s.email,
            role: 'student',
            permissions: s.permissions || [],
            type: 'student',
            identifier: s.studentId
        }));

        const normalizedTeachers = teachers.map(t => ({
            _id: t._id,
            fullName: t.fullName,
            email: t.email,
            role: t.role || 'teacher',
            permissions: t.permissions || [],
            type: 'teacher',
            identifier: t.teacherId
        }));

        const allUsers = [...normalizedUsers, ...normalizedTeachers, ...normalizedStudents];

        return NextResponse.json(allUsers);
    } catch (error) {
        console.error('Error fetching users for permissions:', error);
        return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
    }
}

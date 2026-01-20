import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import User from '@/app/models/userSchema';
import Student from '@/app/models/studentSchema';
import Teacher from '@/app/models/teacherSchema';

export async function PUT(req) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const { userId, type, permissions } = body;

        console.log("Updating permissions", { userId, type, permissions });

        if (!userId || !type) {
            return NextResponse.json({ message: 'Missing userId or type' }, { status: 400 });
        }

        let result;
        if (type === 'student') {
            result = await Student.findByIdAndUpdate(userId, { permissions }, { new: true });
        } else if (type === 'teacher') {
            result = await Teacher.findByIdAndUpdate(userId, { permissions }, { new: true });
        } else {
            // User/Admin/Staff
            result = await User.findByIdAndUpdate(userId, { permissions }, { new: true });
        }

        if (!result) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Permissions updated successfully', permissions: result.permissions });
    } catch (error) {
        console.error('Error updating permissions:', error);
        return NextResponse.json({ message: 'Error updating permissions' }, { status: 500 });
    }
}

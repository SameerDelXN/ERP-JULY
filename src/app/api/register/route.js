
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/mongodb';
import User from '../../models/userSchema';
import teacherSchema from '../../models/teacherSchema';

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      password,
      confirmPassword,
      role,
      department,
      teacherId
    } = body;

    // Ensure role is selected
    if (!role) {
      return NextResponse.json({ error: 'Role is required' }, { status: 400 });
    }

    // ✅ If role is Teacher, register in Teacher model
    if (role === 'Teacher') {
      if (!fullName || !email || !phone || !department || !teacherId) {
        return NextResponse.json({ error: 'All teacher fields are required' }, { status: 400 });
      }

      const existing = await teacherSchema.findOne({
        $or: [{ email }, { teacherId }]
      });

      if (existing) {
        return NextResponse.json({ error: 'Teacher already exists' }, { status: 409 });
      }

      const newTeacher = await teacherSchema.create({
        fullName,
        email,
        phone,
        department,
        teacherId,
        role,
      });

      return NextResponse.json({ message: 'Teacher registered successfully' }, { status: 201 });
    }

    // ✅ Handle normal User registration for other roles
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Optional: Hash password here
    const hashedPassword = password; // Replace with bcrypt.hash(password, salt) if needed

    const newUser = await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

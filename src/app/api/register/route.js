import bcrypt from 'bcryptjs';
import userSchema from '../../models/userSchema';
import { connectToDatabase } from '../../lib/mongodb';

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      password,
      confirmPassword,
      role,
      agreeToTerms
    } = body;

    // Check for missing fields
    if (
      !fullName || !email || !phone || !password ||
      !confirmPassword || !role || agreeToTerms !== true
    ) {
      return new Response(JSON.stringify({
        message: 'All fields are required and you must agree to the terms',
      }), {
        status: 400
      });
    }

    // Validate role
    const validRoles = ['admin', 'student', 'staff', 'parents'];
    if (!validRoles.includes(role)) {
      return new Response(JSON.stringify({
        message: 'Invalid role selected',
      }), {
        status: 400
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return new Response(JSON.stringify({
        message: 'Passwords do not match',
      }), {
        status: 400
      });
    }

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await userSchema.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({
        message: 'User with this email already exists',
      }), {
        status: 409
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = new userSchema({
      fullName,
      email,
      phone,
      password: hashedPassword,
      role,
      agreeToTerms: true
    });

    await user.save();

    return new Response(JSON.stringify({
      message: 'User registered successfully',
      user: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    }), { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({
      message: 'Server error',
    }), {
      status: 500
    });
  }
}

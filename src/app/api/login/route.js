//POST handler to login users
import bcrypt from 'bcryptjs';
import userSchema from '../../models/userSchema';
import { connectToDatabase } from '../../lib/mongodb';
import { cookies } from 'next/headers';
export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, role } = body;

    // Validate input
    if (!email || !password || !role) {
      return new Response(JSON.stringify({
        message: 'Email, password, and role are required'
      }), {
        status: 400,
      });
    }

    // Validate role
    const validRoles = ["admin", "student", "staff", "parents"];
    if (!validRoles.includes(role)) {
      return new Response(JSON.stringify({
        message: 'Invalid role'
      }), {
        status: 400,
      });
    }

    await connectToDatabase();

    // Find user by email and role
    const userFromDB = await userSchema.findOne({ email, role });

    if (!userFromDB) {
      return new Response(JSON.stringify({
        message: 'Invalid email or role'
      }), {
        status: 401,
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, userFromDB.password);
    if (!passwordMatch) {
      return new Response(JSON.stringify({
        message: 'Incorrect password'
      }), {
        status: 401,
      });
    }

    // Update last login timestamp
    const sessionToken = require('crypto').randomBytes(32).toString('hex');
    userFromDB.sessionToken = sessionToken;
    userFromDB.lastLogin = new Date();
    await userFromDB.save();
     cookies().set('sessionToken', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return new Response(JSON.stringify({
      message: 'Login successful',
      user: {
        id: userFromDB._id,
        username: userFromDB.username,
        email: userFromDB.email,
        role: userFromDB.role,
      },
    }), { status: 200 });

  } catch (err) {
    console.error('Login error:', err);
    return new Response(JSON.stringify({
      message: 'Server error'
    }), {
      status: 500,
    });
  }
}

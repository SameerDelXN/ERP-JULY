import bcrypt from 'bcryptjs';
import userSchema from '../../models/userSchema'; 
import { connectToDatabase } from '../../lib/mongodb';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Email and password are required' }), {
        status: 400,
      });
    }

    await connectToDatabase();

    const userFromDB = await userSchema.findOne({ email });

    if (!userFromDB) {
      return new Response(JSON.stringify({ 
        message: 'Invalid email' 
      }), {
        status: 401,
      });
    }

    const passwordMatch = await bcrypt.compare(password, userFromDB.password);

    if (!passwordMatch) {
      return new Response(JSON.stringify({ 
        message: 'Incorrect password' 
      }), {
        status: 401,
      });
    }

    // Update last login timestamp
    userFromDB.lastLogin = new Date();
    await userFromDB.save();

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
    return new Response(JSON.stringify({ message: 'Server error' }), {
      status: 500,
    });
  }
}

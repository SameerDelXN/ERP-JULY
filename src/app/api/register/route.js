import bcrypt from 'bcryptjs';
import userSchema from '../../models/usermodel'; // using @/ for cleaner imports, optional
import { connectToDatabase } from '../../lib/mongodb';

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, email, password,role } = body;

    if (!username || !email || !password || !role) {
      return new Response(JSON.stringify({ 
        message: 'Missing required fields' 
      }), {
        status: 400,
      });
    }

    await connectToDatabase();

    const existingUser = await userSchema.findOne({ 
      email 
    });
    if (existingUser) {
      return new Response(JSON.stringify({ 
        message: 'User already exists' 
      }), {
        status: 409,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userSchema({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    return new Response(JSON.stringify({
      message: 'User registered successfully',
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
    }), { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({ 
      message: 'Server error' 
    }), {
      status: 500,
    });
  }
}

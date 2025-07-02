import { cookies } from 'next/headers';
import userSchema from '../../../models/userSchema';
import { connectToDatabase } from '../../../lib/mongodb';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Properly await the cookies() function
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('sessionToken')?.value;
    
    console.log("Session token from cookies:", sessionToken);

    if (!sessionToken) {
      console.log('No session token found');
      return Response.json({ user: null }, { status: 200 });
    }

    const user = await userSchema.findOne({ sessionToken }).select('-password');
    console.log('User found in DB:', user);

    if (!user) {
      console.log('No user found for session token');
      return Response.json({ user: null }, { status: 200 });
    }

    return Response.json({
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Session error:', error);
    return Response.json(
      { user: null, message: 'Error fetching session' },
      { status: 500 }
    );
  }
}

import { cookies } from 'next/headers';
import userSchema from '../../../models/userSchema';
import teacherSchema from '../../../models/teacherSchema';
import { connectToDatabase } from '../../../lib/mongodb';
//sample
export async function GET() {
  try {
    await connectToDatabase();

    const cookieStore = cookies();
    const sessionToken = cookieStore.get('sessionToken')?.value;
    const role = cookieStore.get('role')?.value;

    console.log("Session token from cookies:", sessionToken);
    console.log("Role from cookies:", role);

    if (!sessionToken || !role) {
      console.log('No session token or role found');
      return Response.json({ user: null }, { status: 200 });
    }

    // If HOD, search in teacher schema
    if (role === 'hod') {
      const hod = await teacherSchema.findOne({ sessionToken }).select('-password');
      if (!hod) {
        return Response.json({ user: null }, { status: 404 });
      }
      console.log(hod)
      return Response.json({
        user: {
          id: hod._id.toString(),
          fullName: hod.fullName,
          email: hod.email,
          role: 'hod',
          department: hod.department,
          teacherId: hod.teacherId,
          isHod: true,
        },
      });
    }

    // For other roles, search in user schema
    const user = await userSchema.findOne({ sessionToken }).select('-password');
    if (!user) {
      return Response.json({ user: null }, { status: 200 });
    }

    return Response.json({
      user: {
        id: user._id.toString(),
        username: user.fullName,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error('Session error:', error);
    return Response.json({ user: null, message: 'Error fetching session' }, { status: 500 });
  }
}



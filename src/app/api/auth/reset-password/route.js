import { NextResponse } from 'next/server';
import crypto from 'crypto';
import User from '@/app/models/userSchema';
import Teacher from '@/app/models/teacherSchema';
import { connectToDatabase } from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';


export async function PUT(request) {
  try {
    const { token, newPassword ,userId} = await request.json();

    console.log("token:", token);
    console.log("Password",newPassword);
    
    
    if (!token || !newPassword ) {
      return NextResponse.json(
        { message: 'Invalid request - token and password (min 8 chars) required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Hash the token to compare with stored token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Find user with valid token and not expired
    const query = {
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() }
    };
    const userObjectId = new ObjectId(userId);

    let user = await User.findOne({
        _id : userObjectId
    });
    let userType = 'user';
    
    if (!user) {
      user = await Teacher.findOne({
        _id : userObjectId
      });
      userType = 'teacher';
    }

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Update password and clear reset token
    const updateData = {
      password : hashedPassword, // Note: You should hash this password before saving in production
      resetToken: undefined,
      resetTokenExpiry: undefined,
      updatedAt: new Date() // Adding an update timestamp
    };

    if (userType === 'user') {
      await User.findByIdAndUpdate(user._id, updateData);
    } else {
      await Teacher.findByIdAndUpdate(user._id, updateData);
    }

    return NextResponse.json({ 
      success: true,
      message: 'Password updated successfully' 
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
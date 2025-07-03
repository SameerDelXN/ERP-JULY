// app/api/users/[id]/route.js
//PUT and DELETE handler to update and delete user by id
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import userSchema from '../../../models/userSchema';

// PUT - Update a user by ID
export async function PUT(req, { params }) {
  const { id } = params;
  const data = await req.json();

  try {
    await connectToDatabase();

    // Disallow password update here for security unless explicitly handled
    if (data.password) {
      return NextResponse.json({
        success: false,
        message: "Password update not allowed in this route."
      }, {
        status: 400
      });
    }

    const updatedUser = await userSchema.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
      select: '-password -resetPasswordToken -resetPasswordExpires -otpCode -otpExpires',
    });

    if (!updatedUser) {
      return NextResponse.json({
        success: false, message: 'User not found'
      }, {
        status: 404
      });
    }

    return NextResponse.json({
      success: true, user: updatedUser
    }, {
      status: 200
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error while updating user',
    }, {
      status: 500
    });
  }
}

// DELETE - Delete a user by ID
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await connectToDatabase();

    const deletedUser = await userSchema.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({
        success: false, message: 'User not found'
      }, {
        status: 404
      });
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    }, {
      status: 200
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error while deleting user',
    }, {
      status: 500
    });
  }
}

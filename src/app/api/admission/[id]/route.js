import { connectToDatabase } from '@/lib/mongoose';
import Admission from '@/app/models/admissionSchema';
import Student from '@/app/models/studentSchema';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const {id} = await params;
    const admissionId = id; // Get id directly from params
    const updateData = await req.json();

    if (!updateData || typeof updateData !== 'object' || Object.keys(updateData).length === 0) {
      return Response.json(
        { success: false, message: "Missing or invalid update data" },
        { status: 400 }
      );
    }

    // Prevent updating certain fields
    const restrictedFields = ['_id', 'enquiryId', 'counsellorId', 'createdAt'];
    for (const field of restrictedFields) {
      if (field in updateData) {
        delete updateData[field];
      }
    }

    // Update admission record
    const updatedAdmission = await Admission
      .findByIdAndUpdate(
        admissionId,
        { $set: updateData },
        { new: true, runValidators: true }
      )
      .lean();

    if (!updatedAdmission) {
      return Response.json(
        { success: false, message: 'Admission not found' },
        { status: 404 }
      );
    }

    // NOTE: Removed automatic student creation on status change
    // Staff should use the dedicated convert endpoint: /api/admission/[id]/convert
    // This prevents PRN conflicts and maintains data consistency

    return Response.json(
      {
        success: true,
        message: 'Admission updated successfully',
        data: updatedAdmission
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Admission PUT error:', error);
    
    if (error.name === 'ValidationError') {
      return Response.json(
        { 
          success: false,
          message: 'Validation failed',
          errors: Object.values(error.errors).map(err => err.message)
        },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return Response.json(
        { 
          success: false,
          message: 'Duplicate value error',
          field: Object.keys(error.keyPattern)[0]
        },
        { status: 409 }
      );
    }

    return Response.json(
      {
        success: false,
        message: 'Server error during update',
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const { id: admissionId } = params;

    // Validate admission ID
    if (!mongoose.Types.ObjectId.isValid(admissionId)) {
      return Response.json(
        { success: false, message: "Invalid admission ID format" },
        { status: 400 }
      );
    }

    // Check for existing student record
    const existingStudent = await Student.findOne({ admissionId });
    if (existingStudent) {
      return Response.json(
        {
          success: false,
          message: "Cannot delete admission - student record exists",
          studentId: existingStudent.studentId,
        },
        { status: 400 }
      );
    }

    // Perform deletion
    const deletedAdmission = await Admission.findByIdAndDelete(
      admissionId
    );

    if (!deletedAdmission) {
      return Response.json(
        { success: false, message: "Admission not found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Admission deleted successfully",
        data: {
          _id: deletedAdmission._id,
          fullName: deletedAdmission.fullName,
          status: deletedAdmission.status,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admission DELETE error:", error);
    return Response.json(
      {
        success: false,
        message: "Server error during deletion",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const {id}  = params;

    console.log("From ID page",id);
    
    const admission = await Admission.findById(id);
    if (!admission) {
      return NextResponse.json(
        { success: false, error: "Admission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: admission });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
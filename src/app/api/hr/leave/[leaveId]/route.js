import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Leave from '@/models/leave';
import Staff from '@/models/staff';
import mongoose from 'mongoose';

export async function PUT(request, { params }) {
  const { leaveId } = params;

  try {
    await connectDB();
    
    // Validate leaveId format
    if (!mongoose.Types.ObjectId.isValid(leaveId)) {
      return NextResponse.json(
        { success: false, error: "Invalid leave ID format" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!["approved", "rejected"].includes(status?.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: "Invalid status value. Must be 'approved' or 'rejected'" },
        { status: 400 }
      );
    }

    // Find the leave application
    const leave = await Leave.findById(leaveId).populate('staffId', 'staffId name');
    if (!leave) {
      return NextResponse.json(
        { success: false, error: "Leave application not found" },
        { status: 404 }
      );
    }

    // Check if leave is already processed
    if (leave.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: "Leave application has already been processed" },
        { status: 400 }
      );
    }

    const newStatus = status.toLowerCase();

    // Handle approval - update staff leave count
    if (newStatus === "approved") {
      const from = new Date(leave.fromDate);
      const to = new Date(leave.toDate);
      
      // Calculate leave days (inclusive of both start and end dates)
      const timeDiff = to.getTime() - from.getTime();
      const leaveDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;

      // Validate staff exists before updating
      const staff = await Staff.findById(leave.staffId);
      if (!staff) {
        return NextResponse.json(
          { success: false, error: "Staff member not found" },
          { status: 404 }
        );
      }

      // Update staff leave count
      await Staff.findByIdAndUpdate(leave.staffId, {
        $inc: { leaveCount: leaveDays }
      });
    }

    // Update leave status
    const updatedLeave = await Leave.findByIdAndUpdate(
      leaveId,
      { 
        status: newStatus,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('staffId', 'name email department');

    return NextResponse.json({ 
      success: true, 
      data: updatedLeave,
      message: `Leave application ${newStatus} successfully`
    }, { status: 200 });

  } catch (error) {
    console.error("❌ PUT /leave/:leaveId error:", error);
    
    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return NextResponse.json(
        { success: false, error: "Invalid leave ID format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
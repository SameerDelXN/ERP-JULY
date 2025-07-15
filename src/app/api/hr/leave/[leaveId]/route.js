import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Leave from '@/models/leave';
import Staff from '@/models/staff';
import mongoose from 'mongoose';


//export async function PUT(request, { context }) {
//   const { leaveId } = context.params;
export async function PUT(request, context) {
  const { leaveId } = context.params;

  try {
    await connectDB();
    const body = await request.json();
    const { status } = body;

    if (!["approved", "rejected"].includes(status?.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: "Invalid status value" },
        { status: 400 }
      );
    }

    const leave = await Leave.findById(leaveId);
    if (!leave) {
      return NextResponse.json(
        { success: false, error: "Leave application not found" },
        { status: 404 }
      );
    }

    // Calculate leave days (before updating)
    let leaveDays = 0;
    if (status.toLowerCase() === "approved") {
      const from = new Date(leave.fromDate);
      const to = new Date(leave.toDate);
      leaveDays = Math.floor((to - from) / (1000 * 60 * 60 * 24)) + 1;

      await Staff.findByIdAndUpdate(leave.staffId, {
        $inc: { leaveCount: leaveDays }
      });
    }

    // Update leave status only
    const updatedLeave = await Leave.findByIdAndUpdate(
      leaveId,
      { status: status.toLowerCase() },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updatedLeave }, { status: 200 });
  } catch (error) {
    console.error("❌ PUT /leave/:leaveId error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

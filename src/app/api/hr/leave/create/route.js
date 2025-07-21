import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Leave from '@/models/leave';
import Staff from '@/models/staff';
import mongoose from 'mongoose';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // You'll need to get the staffId from session/auth or pass it in the request
    // For now, I'll assume it's passed in the body
    const { staffId, leaveType, startDate, endDate, reason, contactNumber } = body;

    // Validate required fields
    if (!staffId || !leaveType || !startDate || !endDate || !reason) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate staff exists
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return NextResponse.json(
        { success: false, error: "Staff member not found" },
        { status: 404 }
      );
    }

    // Calculate leave days
    const from = new Date(startDate);
    const to = new Date(endDate);
    const timeDiff = to.getTime() - from.getTime();
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;

    // Validate dates
    if (days <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid date range" },
        { status: 400 }
      );
    }

    // Create leave request
    const newLeave = new Leave({
      staffId,
      leaveType,
      startDate: from,
      endDate: to,
      fromDate: from, // For backward compatibility
      toDate: to,     // For backward compatibility
      reason,
      contactNumber,
      days,
      status: 'pending'
    });

    const savedLeave = await newLeave.save();
    
    // Populate staff details for response
    const populatedLeave = await Leave.findById(savedLeave._id)
      .populate('staffId', 'name email department');

    return NextResponse.json({ 
      success: true, 
      data: populatedLeave 
    }, { status: 201 });

  } catch (error) {
    console.error("❌ POST /api/hr/leave/create error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
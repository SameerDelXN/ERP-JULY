import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Leave from '@/models/leave';

export async function GET() {
  try {
    await connectDB();
    
    // Fetch all leave requests with staff details
    const leaves = await Leave.find({})
      .populate('staffId', 'name email department')
      .sort({ createdAt: -1 });

    return NextResponse.json({ 
      success: true, 
      data: leaves 
    }, { status: 200 });

  } catch (error) {
    console.error("❌ GET /api/hr/leave/all error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
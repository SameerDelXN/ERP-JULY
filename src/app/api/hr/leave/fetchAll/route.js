import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Leave from '@/models/leave';

// GET /api/leave -> Fetch all leaves
export async function GET() {
  try {
    await connectDB();

    const leaves = await Leave.find({}); // Customize fields if needed

    return NextResponse.json({ success: true, data: leaves }, { status: 200 });
  } catch (error) {
    console.error('Error fetching leaves:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

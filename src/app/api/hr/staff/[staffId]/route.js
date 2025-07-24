import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Staff from '@/models/staff';

// GET /api/staff/[staffId]
export async function GET(req, { params }) {
  const { staffId } = params;

  try {
    await connectDB();

    const staff = await Staff.findOne({ staffId });

    if (!staff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    return NextResponse.json(staff, { status: 200 });
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

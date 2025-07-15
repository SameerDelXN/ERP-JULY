import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Staff from '@/models/staff';

export async function GET() {
  await connectDB();
  try {
    const staffList = await Staff.find().sort({ joiningDate: -1 });
    return NextResponse.json({ success: true, data: staffList });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await connectDB();
  try {
    const data = await request.json();

    // Check if data is an array (bulk insert)
    if (Array.isArray(data)) {
      const staffList = await Staff.insertMany(data);
      return NextResponse.json({ success: true, data: staffList });
    }

    // Single insert
    const newStaff = new Staff(data);
    await newStaff.save();
    return NextResponse.json({ success: true, data: newStaff });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
// PUT: Update staff by ID
export async function PUT(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, error: 'Missing staff ID' }, { status: 400 });
  }

  try {
    const updates = await request.json();
    const updatedStaff = await Staff.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json({ success: true, data: updatedStaff });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
// DELETE: Remove staff by ID
export async function DELETE(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, error: 'Missing staff ID' }, { status: 400 });
  }

  try {
    await Staff.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Staff deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}




import { NextResponse } from 'next/server';
//import connectDB from '@/lib/mongoose';
import { connectToDatabase } from '@/app/lib/mongodb';
import Staff from '@/models/staff';
import Teacher from '@/app/models/teacherSchema';

// GET /api/staff/[staffId]
export async function GET(req, { params }) {
  const { staffId } = params;

  try {
    await connectToDatabase();

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

export async function PUT(request, { params }) {
  await connectToDatabase();
  const { id } = params;

  try {
    const body = await request.json();

    // Try staff first
    let updated = await Staff.findByIdAndUpdate(id, body, { new: true });
    if (!updated) {
      updated = await Teacher.findByIdAndUpdate(id, body, { new: true });
    }

    if (!updated) {
      return NextResponse.json({ success: false, error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  await connectToDatabase();
  

  try {
    const { staffId } = params;
    console.log("Staff ID",staffId);
    // Try deleting from Staff
    let deleted = await Staff.findByIdAndDelete({staffId});
    if (!deleted) {
      deleted = await Teacher.findByIdAndDelete(staffId);
    }

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
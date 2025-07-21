import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Leave from '@/models/leave';
import  Staff  from '@/models/staff';
// Create leave request (POST)
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const leave = await Leave.create(body);

    return Response.json({ success: true, data: leave }, { status: 201 });
  } catch (error) {
    console.error("💥 Leave POST Error:", error); // log the error
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Get all leave requests (GET)
/*  export async function GET() {
  try {
    await connectDB();
    const leaves = await Leave.find();
    return Response.json({ success: true, data: leaves });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

*/

export async function GET() {
  await connectDB();

  try {
    const leaves = await Leave.find({})
     

    return NextResponse.json({ success: true, data: leaves });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}




export async function PUT(request) {
  await connectDB();
  try {
    const { leaveId, status } = await request.json();

    const updatedLeave = await Leave.findByIdAndUpdate(
      leaveId,
      { status },
      { new: true }
    );

    if (!updatedLeave) {
      return NextResponse.json({ success: false, error: 'Leave not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedLeave });
  } catch (error) {
    console.error("💥 Leave APPROVAL Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

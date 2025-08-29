import { NextResponse } from 'next/server';
//import connectDB from '@/lib/mongoose';
import { connectToDatabase } from '@/app/lib/mongodb';
import Staff from '@/models/staff';
import teacher from '@/app/models/teacherSchema';

export async function GET() {
  await connectToDatabase();
  try {
    const staffList = await Staff.find().sort({ joiningDate: -1 });
    const teacherList = await teacher.find().sort({dateOfJoining:-1});

    return NextResponse.json({ success: true, staff: staffList , teacher:teacherList});
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await connectToDatabase();
  try {
    const body = await request.json();

    const existing = await Staff.findOne({staffId:body.staffId});
    if(existing){
      return NextResponse.json(
        {success:false,error:"staff Id already present"},
        {status:404}
      );
    }

    const newStaff = await Staff.create(body);

    if(body.designation && body.designation.toLowerCase() === "teacher"){
      await teacher.create({
        teacherId:newStaff.staffId,
        fullName : newStaff.name,
        email : newStaff.email,
        department:newStaff.department,
        role:newStaff.designation,
        dateOfJoining : newStaff.joiningData,
        phone : newStaff.phone
      });
    }

    return NextResponse.json({success:true,data:newStaff},{status:200});

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
// PUT: Update staff by ID
export async function PUT(request) {
  await connectToDatabase();
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
  await connectToDatabase();
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




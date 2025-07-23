import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongoose';
import Leave from '@/models/leave';
import Staff from '@/models/staff';

export async function GET(req, context) {
  const identifier = context.params.staffId; // could be STF010 or ObjectId
  await connectDB();

  try {
    console.log('📥 Incoming identifier:', identifier);

    // ✅ Resolve staff (by ObjectId or staffId)
    let staff = null;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      staff = await Staff.findById(identifier);
    }

    if (!staff) {
      staff = await Staff.findOne({ staffId: identifier });
    }

    if (!staff) {
      return NextResponse.json({ success: false, message: 'Staff not found' }, { status: 404 });
    }

    console.log('✅ Staff found:', staff.name);

    // ✅ Fetch leave records using ObjectId from staff
    const leaves = await Leave.find({ staffId: staff._id }).populate('staffId', 'staffId name');

    return NextResponse.json({ success: true, data: leaves });
  } catch (error) {
    console.error('❌ Leave fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

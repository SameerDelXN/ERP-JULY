import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import FeeStructure from '@/models/feeStructure';

export async function PATCH(request, { params }) {
  await connectDB();
  try {
    const { className, structure } = await request.json();

    const updated = await FeeStructure.findByIdAndUpdate(params.id, {
      className, structure
    }, { new: true });

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Structure not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  await connectDB();
  try {
    const deleted = await FeeStructure.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Structure not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

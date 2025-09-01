import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import FeeHead from '@/models/feeHead';

export async function PATCH(request, { params }) {
  await connectDB();
  try {
    const { name, description, isActive } = await request.json();

    const updated = await FeeHead.findByIdAndUpdate(params.id, {
      name, description, isActive
    }, { new: true });

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Fee Head not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  await connectDB();
  try {
    const deleted = await FeeHead.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Fee Head not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Fee Head deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

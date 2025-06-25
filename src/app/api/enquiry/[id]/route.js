//for PUT and DELETE enquiry based on id


import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import Enquiry from '../../../models/enquiryschema';

// DELETE /api/enquiry/[id]
export async function DELETE(_, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;

    const deleted = await Enquiry.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: 'Enquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Enquiry deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// PUT /api/enquiry/[id]
export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const { status } = await req.json();

    const validStatuses = ['New', 'In Progress', 'Converted', 'Lost'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: 'Invalid status value' }, { status: 400 });
    }

    const updated = await Enquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: 'Enquiry not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Enquiry status updated',
      enquiry: updated,
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

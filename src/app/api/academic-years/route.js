import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import AcademicYear from '@/models/academicYear';

export async function GET() {
  try {
    await connectToDatabase();
    const years = await AcademicYear.find({}).sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ success: true, years });
  } catch (error) {
    console.error('Error fetching academic years:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const { name, label, order } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Year name is required' }, { status: 400 });
    }

    const existing = await AcademicYear.findOne({ name: name.trim() });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Academic year already exists' }, { status: 400 });
    }

    // Auto-generate label if not provided
    const yearLabel = label || `${name.trim()} Year`;

    // Auto-calculate order if not provided
    const count = await AcademicYear.countDocuments();
    const yearOrder = order !== undefined ? order : count + 1;

    const year = await AcademicYear.create({
      name: name.trim(),
      label: yearLabel,
      order: yearOrder
    });

    return NextResponse.json({ success: true, year });
  } catch (error) {
    console.error('Error creating academic year:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Academic year ID is required' }, { status: 400 });
    }

    await AcademicYear.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Academic year deleted successfully' });
  } catch (error) {
    console.error('Error deleting academic year:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

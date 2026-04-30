import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import ProgramType from '@/models/programType';

export async function GET() {
  try {
    await connectToDatabase();
    const programTypes = await ProgramType.find({}).sort({ createdAt: 1 });
    return NextResponse.json({ success: true, programTypes });
  } catch (error) {
    console.error('Error fetching program types:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const { name } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Program type name is required' }, { status: 400 });
    }

    const existing = await ProgramType.findOne({ name: name.trim() });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Program type already exists' }, { status: 400 });
    }

    const programType = await ProgramType.create({ name: name.trim() });
    return NextResponse.json({ success: true, programType });
  } catch (error) {
    console.error('Error creating program type:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Program type ID is required' }, { status: 400 });
    }

    await ProgramType.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Program type deleted successfully' });
  } catch (error) {
    console.error('Error deleting program type:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

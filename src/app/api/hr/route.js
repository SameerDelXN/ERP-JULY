// /app/api/hr/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import HR from '@/models/hr'; // Make sure this model exists

export async function POST(request) {
  await connectDB();

  try {
    const body = await request.json();

    const hr = await HR.create(body);

    return NextResponse.json({
      message: 'HR created successfully',
      hr
    });
  } catch (error) {
    console.error('POST /api/hr error:', error);
    return NextResponse.json(
      { error: 'Failed to create HR', details: error.message },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    await connectDB();

    const hrList = await HR.find(); // get all HRs

    return Response.json({
      success: true,
      data: hrList
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

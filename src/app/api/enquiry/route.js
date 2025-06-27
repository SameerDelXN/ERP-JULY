//for GET and POST enquiry

import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/mongodb';
import enquirySchema from '../../models/enquirySchema';

export async function GET() {
  try {
    await connectToDatabase();
    const enquiries = await enquirySchema.find().sort({
      createdAt: -1
    }); // latest first
    return NextResponse.json(enquiries, {
      status: 200
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json({
      message: 'Server error'
    }, {
      status: 500
    });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const enquiry = new enquirySchema(body);
    await enquiry.save();

    return NextResponse.json({
      success: true,
      message: 'Enquiry submitted successfully'
    }, {
      status: 201
    });

  } catch (error) {
    console.error('Error creating enquiry:', error);
    return NextResponse.json({
      success: false,
      message: error.message,
    }, {
      status: 400
    });
  }
}

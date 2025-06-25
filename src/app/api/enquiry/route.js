//for GET and POST enquiry


// import { NextResponse } from 'next/server';
// import { connectToDatabase } from '../../lib/mongodb'; // adjust path if needed
// import Enquiry from '../../models/enquiryform'; // use the updated schema

// export async function POST(req) {
//   try {
//     await connectToDatabase();

//     const body = await req.json();

//     const enquiry = new Enquiry({
//       name: body.name,
//       phone: body.phone,
//       email: body.email,
//       courseInterested: body.courseInterested,
//       source: body.source, // Website, Call, Walk-in, Campaign
//       status: body.status || 'New', // default to 'New' if not provided
//       counsellorId: body.counsellorId, // optional
//       followUps: body.followUps || [] // optional
//     });

//     await enquiry.save();

//     return NextResponse.json({
//       success: true,
//       message: 'Enquiry submitted successfully'
//     }, { status: 201 });

//   } catch (error) {
//     console.error('Error saving enquiry:', error);
//     return NextResponse.json({
//       success: false,
//       error: error.message
//     }, { status: 400 });
//   }
// }


import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/mongodb';
import Enquiry from '../../models/enquirySchema';

export async function GET() {
  try {
    await connectToDatabase();
    const enquiries = await Enquiry.find().sort({ createdAt: -1 }); // latest first
    return NextResponse.json(enquiries, { status: 200 });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const enquiry = new Enquiry(body);
    await enquiry.save();

    return NextResponse.json({
      success: true,
      message: 'Enquiry submitted successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating enquiry:', error);
    return NextResponse.json({
      success: false,
      message: error.message,
    }, { status: 400 });
  }
}

import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/mongodb'; // adjust path if needed
import Enquiry from '../../models/enquiryform'; // use the updated schema

export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const enquiry = new Enquiry({
      name: body.name,
      phone: body.phone,
      email: body.email,
      courseInterested: body.courseInterested,
      source: body.source, // Website, Call, Walk-in, Campaign
      status: body.status || 'New', // default to 'New' if not provided
      counsellorId: body.counsellorId, // optional
      followUps: body.followUps || [] // optional
    });

    await enquiry.save();

    return NextResponse.json({
      success: true,
      message: 'Enquiry submitted successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error saving enquiry:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 400 });
  }
}




/* Required Fields – Pre-Admission Enquiry Form
Student Information
First Name
Last Name
Date of Birth
Gender
Nationality
Parent/Guardian Details
Father’s Full Name
Mother’s Full Name
Mobile Number
Email Address
Contact & Address Details
Address Line 1
City
State
Postal/Zip Code
Country
Academic Details
Current School Name
Current Class
Applying For Class
Academic Year Applying For
Preferred Medium of Instruction
Document Uploads
Birth Certificate (PDF/JPG)
Parent Aadhaar or PAN Card (PDF/JPG)
Consent
Checkbox: I agree to the Terms & Privacy Policy
CAPTCHA / Bot Verification
 */

//import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/mongodb';
import admissionSchema from '../../models/admissionSchema';

export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const {
      first,
      middle,
      last,
      dateOfBirth,
      gender,
      nationality,

      fatherName,
      motherName,
      parentMobile,
      parentEmail,

      addressLine,
      city,
      state,
      pincode,
      country,

      currentSchoolName,
      currentClass,
      applyingForClass,
      academicYear,
      preferredMedium,

      documents,
      consent,
      captchaVerified
    } = body;

    // ✅ Validate required fields
    if (
      !first || !last || !dateOfBirth || !gender || !nationality ||
      !currentSchoolName || !currentClass || !applyingForClass ||
      !academicYear || !preferredMedium || consent !== true || captchaVerified !== true
    ) {
      return new Response(JSON.stringify({
        message: 'Missing or invalid required fields'
      }), {
        status: 400
      });
    }

    // ✅ Create and save admission
    const newAdmission = new admissionSchema({
      first,
      middle,
      last,
      dateOfBirth,
      gender,
      nationality,

      fatherName,
      motherName,
      parentMobile,
      parentEmail,

      addressLine,
      city,
      state,
      pincode,
      country,

      currentSchoolName,
      currentClass,
      applyingForClass,
      academicYear,
      preferredMedium,

      documents,
      consent,
      captchaVerified
    });

    await newAdmission.save();

    return new Response(JSON.stringify({
      message: 'Admission form submitted successfully'
    }), {
      status: 201
    });
  } catch (error) {
    console.error('Admission POST error:', error);
    return new Response(JSON.stringify({
      message: 'Server error', error: error.message
    }), {
      status: 500
    });
  }
}



export async function GET() {
  try {
    await connectToDatabase();

    const admissions = await admissionSchema.find().sort({
      createdAt: -1
    }); // optional: newest first

    return new Response(JSON.stringify(admissions), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Admission GET error:', error);
    return new Response(JSON.stringify({
      message: 'Server error',
      error: error.message
    }), {
      status: 500
    });
  }
}
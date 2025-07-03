import { connectToDatabase } from '../../lib/mongodb';
import admissionSchema from '../../models/admissionSchema';
export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const {
      enquiryId,        // ✅ Include enquiryId
      counsellorId,     // ✅ Include counsellorId
      fullName,
      dateOfBirth,
      gender,
      nationality,
      category,
      mobileNumber,
      email,

      fatherName,
      motherName,
      parentMobile,
      parentEmail,
      familyIncome,

      addressLine,
      city,
      state,
      pincode,
      country,

      courseName,

      currentSchoolName,
      currentClass,
      applyingFor,
      academicYear,
      preferredMedium,

      documents,
      consent,
      captchaVerified,

      status // optional
    } = body;

    // ✅ Validate required fields
    if (
      !enquiryId || !counsellorId || !fullName || !dateOfBirth || !gender || !nationality ||
      !mobileNumber || !courseName || consent !== true || captchaVerified !== true
    ) {
      return new Response(JSON.stringify({
        message: 'Missing or invalid required fields'
      }), {
        status: 400
      });
    }

    const allowedStatus = ['inProcess', 'approved', 'rejected'];
    const finalStatus = allowedStatus.includes(status) ? status : 'inProcess';

    const newAdmission = new admissionSchema({
      enquiryId,
      counsellorId,

     fullName,
      dateOfBirth,
      gender,
      nationality,
      category,
      mobileNumber,
      email,

      fatherName,
      motherName,
      parentMobile,
      parentEmail,
      familyIncome,

      addressLine,
      city,
      state,
      pincode,
      country,

      courseName,

      currentSchoolName,
      currentClass,
      applyingFor,
      academicYear,
      preferredMedium,

      documents,
      consent,
      captchaVerified,

      status: finalStatus
    });

    await newAdmission.save();

    return new Response(JSON.stringify({
      message: 'Admission form submitted successfully',
      admissionId: newAdmission._id
    }), {
      status: 201
    });
  } catch (error) {
    console.error('Admission POST error:', error);
    return new Response(JSON.stringify({
      message: 'Server error',
      error: error.message
    }), {
      status: 500
    });
  }
}


export async function GET() {
  try {
    await connectToDatabase();

    // Fetch all admissions
    const admissions = await admissionSchema.find({}).sort({ createdAt: -1 });

    return Response.json({
      success: true,
      data: admissions
    });

  } catch (error) {
    console.error('Error fetching admissions:', error);
    return Response.json(
      {
        success: false,
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
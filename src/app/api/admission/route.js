
import { connectToDatabase } from '../../lib/mongodb';
import admissionSchema from '../../models/admissionSchema';
//sample chnage2
export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const {
      enquiryId,        // ✅ Include enquiryId
      counsellorId,     // ✅ Include counsellorId

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
      !enquiryId || !counsellorId || !first || !last || !dateOfBirth || !gender || !nationality ||
      !currentSchoolName || !currentClass || !applyingFor ||
      !academicYear || !preferredMedium || consent !== true || captchaVerified !== true
    ) {
      return new Response(JSON.stringify({
        message: 'Missing or invalid required fields'
      }), {
        status: 400
      });
    }

    const allowedStatus = ['pending', 'approved', 'rejected'];
    const finalStatus = allowedStatus.includes(status) ? status : 'pending';

    const newAdmission = new admissionSchema({
      enquiryId,
      counsellorId,

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

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
      captchaVerified,

      status // 👈 New field (optional)
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

    // ✅ Validate status if provided
    const allowedStatus = ['pending', 'approved', 'rejected'];
    const finalStatus = allowedStatus.includes(status) ? status : 'pending';

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
      captchaVerified,
      status: finalStatus // 👈 Include validated status
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

// import { connectToDatabase } from "../../lib/mongodb";
// import admissionSchema from "../../models/admissionSchema";
// export async function POST(req) {
//   try {
//     await connectToDatabase();

//     const body = await req.json();

//     const {
//       enquiryId, // ✅ Include enquiryId
//       counsellorId, // ✅ Include counsellorId
//       dteApplicationNumber,
//       admissionYear,
//       fullName,
//       nameAsPerAadhar,
//       email,
//       studentWhatsappNumber,
//       branch,
//       dateOfBirth,
//       gender,
//       nationality,
//       category,
//       addressLine,
//       city,
//       state,
//       pincode,
//       country,
//       fatherName,
//       motherName,
//       status,
//       consent,
//       captchaVerified,
//     } = body;

//     // ✅ Validate required fields
//     if (
//       !enquiryId ||
//       !counsellorId ||
//       !fullName ||
//       !dateOfBirth ||
//       !gender ||
//       !nationality ||
//       !mobileNumber ||
//       !courseName ||
//       consent !== true ||
//       captchaVerified !== true
//     ) {
//       return new Response(
//         JSON.stringify({
//           message: "Missing or invalid required fields",
//         }),
//         {
//           status: 400,
//         }
//       );
//     }

//     const allowedStatus = ["inProcess", "approved", "rejected"];
//     const finalStatus = allowedStatus.includes(status) ? status : "inProcess";

//     const newAdmission = new admissionSchema({
//       enquiryId, // ✅ Include enquiryId
//       counsellorId, // ✅ Include counsellorId
//       dteApplicationNumber,
//       admissionYear,
//       fullName,
//       nameAsPerAadhar,
//       email,
//       studentWhatsappNumber,
//       branch,
//       dateOfBirth,
//       gender,
//       nationality,
//       category,
//       addressLine,
//       city,
//       state,
//       pincode,
//       country,
//       fatherName,
//       motherName,
//       consent,
//       captchaVerified,
//       status: finalStatus,
//     });

//     await newAdmission.save();

//     return new Response(
//       JSON.stringify({
//         message: "Admission form submitted successfully",
//         admissionId: newAdmission._id,
//       }),
//       {
//         status: 201,
//       }
//     );
//   } catch (error) {
//     console.error("Admission POST error:", error);
//     return new Response(
//       JSON.stringify({
//         message: "Server error",
//         error: error.message,
//       }),
//       {
//         status: 500,
//       }
//     );
//   }
// }

// export async function GET() {
//   try {
//     await connectToDatabase();

//     // Fetch all admissions
//     const admissions = await admissionSchema.find({}).sort({ createdAt: -1 });

//     return Response.json({
//       success: true,
//       data: admissions,
//     });
//   } catch (error) {
//     console.error("Error fetching admissions:", error);
//     return Response.json(
//       {
//         success: false,
//         message: "Internal server error",
//       },
//       { status: 500 }
//     );
//   }
// }

import { connectToDatabase } from "../../lib/mongodb";
import admissionSchema from "../../models/admissionSchema";

export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();

    // Destructure all possible fields from the request body
    const {
      enquiryId,
      counsellorId,
      dteApplicationNumber,
      admissionYear,
      email,
      fullName,
      nameAsPerAadhar,
      firstName,
      middleName,
      lastName,
      gender,
      programType,
      year,
      branch,
      shift,
      round,
      quota,
      seatType,
      admissionCategoryDTE,
      feesCategory,
      admissionType,
      casteAsPerLC,
      subCasteAsPerLC,
      domicile,
      nationality,
      religionAsPerLC,
      isForeignNational,
      dateOfBirth,
      motherName,
      familyIncome,
      studentWhatsappNumber,
      fatherGuardianWhatsappNumber,
      motherMobileNumber,
      address,
      documents,
      status,
    } = body;
    console.log(programType)
    // Validate required fields
    const requiredFields = {
      email,
      fullName,
      dateOfBirth,
      gender,
      nationality,
      studentWhatsappNumber,
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value || (typeof value === 'boolean' && value !== true)) {
        return Response.json(
          { success: false, message: `Missing or invalid required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create the admission record
    const newAdmission = new admissionSchema({
      enquiryId,
      counsellorId,
      dteApplicationNumber,
      admissionYear,
      email: email.toLowerCase(),
      fullName,
      nameAsPerAadhar,
      firstName,
      middleName,
      lastName,
      gender,
      programType,
      year,
      branch,
      shift,
      round,
      quota,
      seatType,
      admissionCategoryDTE,
      feesCategory,
      admissionType,
      casteAsPerLC,
      subCasteAsPerLC,
      domicile,
      nationality,
      religionAsPerLC,
      isForeignNational,
      dateOfBirth,
      motherName,
      familyIncome,
      studentWhatsappNumber,
      fatherGuardianWhatsappNumber,
      motherMobileNumber,
      address,
      documents,
      status: status || "inProcess",
    });

    await newAdmission.save();

    return Response.json(
      {
        success: true,
        message: "Admission form submitted successfully",
        admissionId: newAdmission._id,
        prn: newAdmission.prn
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admission POST error:", error);
    
    // Handle duplicate key errors (like unique PRN)
    if (error.code === 11000) {
      return Response.json(
        {
          success: false,
          message: "Duplicate value error",
          error: error.message,
          field: Object.keys(error.keyPattern)[0]
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: false,
        message: "Server error",
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch all admissions with basic details
    const admissions = await admissionSchema.find({})
      
    return Response.json({
      success: true,
      count: admissions.length,
      data: admissions,
    });
  } catch (error) {
    console.error("Error fetching admissions:", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message
      },
      { status: 500 }
    );
  }
}


// import { connectToDatabase } from "../../lib/mongodb";
// import admissionSchema from "../../models/admissionSchema";

// export async function POST(req) {
//   try {
//     await connectToDatabase();

//     const body = await req.json();

//     // Destructure all possible fields from the request body
//     const {
//       enquiryId,
//       counsellorId,
//       dteApplicationNumber,
//       admissionYear,
//       email,
//       fullName,
//       nameAsPerAadhar,
//       firstName,
//       middleName,
//       lastName,
//       gender,
//       programType,
//       year,
//       branch,
//       shift,
//       round,
//       quota,
//       seatType,
//       admissionCategoryDTE,
//       feesCategory,
//       admissionType,
//       casteAsPerLC,
//       subCasteAsPerLC,
//       domicile,
//       nationality,
//       religionAsPerLC,
//       isForeignNational,
//       dateOfBirth,
//       motherName,
//       familyIncome,
//       studentWhatsappNumber,
//       fatherGuardianWhatsappNumber,
//       motherMobileNumber,
//       address,
//       documents,
//       status,
//     } = body;
//     console.log(programType)
//     // Validate required fields
//     const requiredFields = {
//       email,
//       fullName,
//       dateOfBirth,
//       gender,
//       nationality,
//       studentWhatsappNumber,
//     };

//     for (const [field, value] of Object.entries(requiredFields)) {
//       if (!value || (typeof value === 'boolean' && value !== true)) {
//         return Response.json(
//           { success: false, message: `Missing or invalid required field: ${field}` },
//           { status: 400 }
//         );
//       }
//     }

//     // Create the admission record
//     const newAdmission = new admissionSchema({
//       enquiryId,
//       counsellorId,
//       dteApplicationNumber,
//       admissionYear,
//       email: email.toLowerCase(),
//       fullName,
//       nameAsPerAadhar,
//       firstName,
//       middleName,
//       lastName,
//       gender,
//       programType,
//       year,
//       branch,
//       shift,
//       round,
//       quota,
//       seatType,
//       admissionCategoryDTE,
//       feesCategory,
//       admissionType,
//       casteAsPerLC,
//       subCasteAsPerLC,
//       domicile,
//       nationality,
//       religionAsPerLC,
//       isForeignNational,
//       dateOfBirth,
//       motherName,
//       familyIncome,
//       studentWhatsappNumber,
//       fatherGuardianWhatsappNumber,
//       motherMobileNumber,
//       address,
//       documents,
//       status: status || "inProcess",
//     });

//     await newAdmission.save();

//     return Response.json(
//       {
//         success: true,
//         message: "Admission form submitted successfully",
//         admissionId: newAdmission._id,
//         prn: newAdmission.prn
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Admission POST error:", error);
    
//     // Handle duplicate key errors (like unique PRN)
//     if (error.code === 11000) {
//       return Response.json(
//         {
//           success: false,
//           message: "Duplicate value error",
//           error: error.message,
//           field: Object.keys(error.keyPattern)[0]
//         },
//         { status: 400 }
//       );
//     }

//     return Response.json(
//       {
//         success: false,
//         message: "Server error",
//         error: error.message
//       },
//       { status: 500 }
//     );
//   }
// }

// export async function GET() {
//   try {
//     await connectToDatabase();

//     // Fetch all admissions with basic details
//     const admissions = await admissionSchema.find({})
      
//     return Response.json({
//       success: true,
//       count: admissions.length,
//       data: admissions,
//     });
//   } catch (error) {
//     console.error("Error fetching admissions:", error);
//     return Response.json(
//       {
//         success: false,
//         message: "Internal server error",
//         error: error.message
//       },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { connectToDatabase } from "../../lib/mongodb";
import Admission from "../../models/admissionSchema";
import FeeStructure from "../../models/feeStructureSchema";

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

    // Validate required fields
    const requiredFields = {
      email,
      fullName,
      dateOfBirth,
      gender,
      nationality,
      studentWhatsappNumber,
      admissionYear,
      programType,
      branch,
      year,
      round,
      seatType,
      admissionCategoryDTE,
      feesCategory,
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (value === undefined || value === null || value === "") {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate feesCategory against fee structure
    if (programType && branch && year && casteAsPerLC && feesCategory) {
      const feeStructure = await FeeStructure.findOne({
        programType,
        departmentName: branch,
        year,
        caste: casteAsPerLC.toLowerCase() || "general",
        scholarshipParticular: feesCategory,
      });

      if (!feeStructure) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid fees category for the selected program type, branch, year, and caste",
          },
          { status: 400 }
        );
      }
    }

    // Create the admission record
    const newAdmission = new Admission({
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

    return NextResponse.json(
      {
        success: true,
        message: "Admission form submitted successfully",
        admissionId: newAdmission._id,
        isPrnGenerated: newAdmission.isPrnGenerated,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admission POST error:", error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Duplicate value error",
          error: error.message,
          field: Object.keys(error.keyPattern)[0],
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch all admissions
    const admissions = await Admission.find({}).lean();

    return NextResponse.json({
      success: true,
      count: admissions.length,
      data: admissions,
    });
  } catch (error) {
    console.error("Error fetching admissions:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Admission ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
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
      isPrnGenerated,
    } = body;

    // Validate feesCategory if provided
    if (feesCategory && programType && branch && year && casteAsPerLC) {
      const feeStructure = await FeeStructure.findOne({
        programType,
        departmentName: branch,
        year,
        caste: casteAsPerLC.toLowerCase(),
        scholarshipParticular: feesCategory,
      });

      if (!feeStructure) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid fees category for the selected program type, branch, year, and caste",
          },
          { status: 400 }
        );
      }
    }

    const updatedAdmission = await Admission.findByIdAndUpdate(
      id,
      {
        enquiryId,
        counsellorId,
        dteApplicationNumber,
        admissionYear,
        email: email?.toLowerCase(),
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
        isPrnGenerated,
      },
      { new: true, runValidators: true }
    );

    if (!updatedAdmission) {
      return NextResponse.json(
        { success: false, message: "Admission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedAdmission },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admission PUT error:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Duplicate value error",
          error: error.message,
          field: Object.keys(error.keyPattern)[0],
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
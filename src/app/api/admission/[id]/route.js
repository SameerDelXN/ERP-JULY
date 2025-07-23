// import { connectToDatabase } from '../../../lib/mongodb';
// import admissionSchema from '../../../models/admissionSchema';

// // PUT - Update admission by ID (from params)
// import studentSchema from '../../../models/studentSchema';
// import academicSchema from '../../../models/academicSchema';

// export async function PUT(req, { params }) {
//   try {
//     await connectToDatabase();
//     const updateData = await req.json();
//     const { id: admissionId } = params;

//     if (!admissionId || !updateData || typeof updateData !== 'object') {
//       return new Response(JSON.stringify({
//         message: 'Missing or invalid admissionId or update data'
//       }), { status: 400 });
//     }

//     // 1. Update admission
//     const updatedAdmission = await admissionSchema.findByIdAndUpdate(
//       admissionId,
//       updateData,
//       { new: true }
//     );

//     if (!updatedAdmission) {
//       return new Response(JSON.stringify({ message: 'Admission not found' }), { status: 404 });
//     }

//     // 2. Only proceed if status is approved
//     if (updateData.status === 'approved') {
//       const department = updatedAdmission.courseName; // department = courseName
//       const rawYear = updatedAdmission.yearOfAdmission; // e.g. "1st Year"
//       const year = rawYear?.split(" ")[0]; // "1st", "2nd", etc.

//       if (!department || !year) {
//         return new Response(JSON.stringify({
//           message: 'Cannot determine department or year from admission data'
//         }), { status: 400 });
//       }

//       // Check if student already exists
//       let student = await studentSchema.findOne({ admissionId: updatedAdmission._id });

//       if (!student) {
//         const studentCount = await studentSchema.countDocuments();
//         const studentId = `SCH${new Date().getFullYear()}-${String(studentCount + 1).padStart(3, '0')}`;

//         student = await studentSchema.create({
//           studentId,
//           admissionId: updatedAdmission._id,
//           fullName: updatedAdmission.fullName,
//           email: updatedAdmission.email,
//           studentWhatsappNumber: updatedAdmission.studentWhatsappNumber,
//           dateOfBirth: updatedAdmission.dateOfBirth,
//           address: {
//             addressLine: updatedAdmission.addressLine,
//             city: updatedAdmission.city,
//             state: updatedAdmission.state,
//             pincode: updatedAdmission.pincode,
//             country: updatedAdmission.country,
//           },
//           status: 'active',
//         });
//       }

//       // Find academic record
//       const academic = await academicSchema.findOne({
//         department,
//         years: { $elemMatch: { year, 'divisions.students': { $exists: true } } }
//       });

//       if (!academic) {
//         return new Response(JSON.stringify({
//           message: 'Academic record not found for department and year'
//         }), { status: 404 });
//       }

//       // Find the correct year and a division with space
//       const yearObj = academic.years.find(y => y.year === year);
//       const division = yearObj?.divisions?.find(div => div.students.length < 50);

//       if (!division) {
//         return new Response(JSON.stringify({
//           message: 'No division with available capacity found'
//         }), { status: 400 });
//       }

//       // Avoid duplicate
//       if (!division.students.some(s => s.equals(student._id))) {
//         division.students.push(student._id);
//         await academic.save();
//       }
//     }

//     return new Response(JSON.stringify({
//       message: 'Admission updated successfully',
//       data: updatedAdmission
//     }), { status: 200 });

//   } catch (error) {
//     console.error('Admission PUT error:', error);
//     return new Response(JSON.stringify({
//       message: 'Server error during update',
//       error: error.message
//     }), { status: 500 });
//   }
// }

// // DELETE - Delete admission by ID (from params)
// export async function DELETE(req, { params }) {
//   try {
//     await connectToDatabase();
//     const { id: admissionId } = params;

//     if (!admissionId) {
//       return new Response(JSON.stringify({
//         message: 'Admission ID is required'
//       }), {
//         status: 400
//       });
//     }

//     const deletedAdmission = await admissionSchema.findByIdAndDelete(admissionId);

//     if (!deletedAdmission) {
//       return new Response(JSON.stringify({
//         message: 'Admission not found'
//       }), {
//         status: 404
//       });
//     }

//     return new Response(JSON.stringify({
//       message: 'Admission deleted successfully',
//       data: deletedAdmission
//     }), {
//       status: 200
//     });

//   } catch (error) {
//     console.error('Admission DELETE error:', error);
//     return new Response(JSON.stringify({
//       message: 'Server error during deletion',
//       error: error.message
//     }), {
//       status: 500
//     });
//   }
// }

// import { connectToDatabase } from "../../../lib/mongodb";
// import admissionSchema from "../../../models/admissionSchema";
// import studentSchema from "../../../models/studentSchema";
// import academicSchema from "../../../models/academicSchema";

// export async function PUT(req, { params }) {
//   try {
//     await connectToDatabase();
//     const { id: admissionId } = params;
//     const updateData = await req.json();

//     console.log(updateData);

//     if (
//       !updateData ||
//       typeof updateData !== "object" ||
//       Object.keys(updateData).length === 0
//     ) {
//       return Response.json(
//         { success: false, message: "Missing or invalid update data" },
//         { status: 400 }
//       );
//     }

//     // Prevent updating certain fields
//     const restrictedFields = ["_id", "enquiryId", "counsellorId", "createdAt"];
//     for (const field of restrictedFields) {
//       if (field in updateData) {
//         delete updateData[field];
//       }
//     }
//     console.log("Update Data : ", updateData);

//     // Update admission record
//     const updatedAdmission = await admissionSchema
//       .findByIdAndUpdate(
//         admissionId,
//         { $set: updateData },
//         { new: true, runValidators: true }
//       )
//       .lean();

//     console.log("Update Admission : ", updatedAdmission);

//     if (!updatedAdmission) {
//       return Response.json(
//         { success: false, message: "Admission not found" },
//         { status: 404 }
//       );
//     }

//     // Handle status change to 'approved'
//     if (updateData.status === "approved") {
//       await handleApprovedStatus(updatedAdmission, admissionId);
//     }

//     return Response.json({
//       success: true,
//       message: "Admission updated successfully",
//       data: updatedAdmission,
//     });
//   } catch (error) {
//     console.error("Admission PUT error:", error);

//     // Handle specific error cases
//     let status = 500;
//     let message = "Server error during update";
//     let errors = null;

//     if (error.name === "ValidationError") {
//       status = 400;
//       message = "Validation failed";
//       errors = Object.values(error.errors).map((err) => err.message);
//     } else if (error.code === 11000) {
//       status = 409;
//       message = "Duplicate value error";
//     }

//     return Response.json({ success: false, message, errors }, { status });
//   }
// }

// async function handleApprovedStatus(admission, admissionId) {
//   const {
//     programType,
//     year,
//     branch,
//     fullName,
//     email,
//     studentWhatsappNumber,
//     dateOfBirth,
//     address,
//     isForeignNational,
//     nationality,
//   } = admission;

//   // Validate required fields for student creation
//   if (!programType || !year || !branch) {
//     throw new Error(
//       "Missing academic details (programType, year, or branch) required for student creation"
//     );
//   }

//   // Check/create student record
//   let student = await studentSchema.findOne({ admissionId });

//   if (!student) {
//     const studentCount = await studentSchema.countDocuments();
//     const studentId = `SCH${new Date().getFullYear()}-${String(
//       studentCount + 1
//     ).padStart(4, "0")}`;

//     student = await studentSchema.create({
//       studentId,
//       admissionId,
//       fullName,
//       email: email?.toLowerCase(),
//       mobileNumber: studentWhatsappNumber,
//       dateOfBirth,
//       address: address?.[0] || {},
//       nationality,
//       isForeignNational: isForeignNational || false,
//       status: "active",
//       academicDetails: {
//         programType,
//         currentYear: year,
//         branch,
//       },
//     });
//   }

//   // Update academic record
//  const academic = await academicSchema.findOne({
//   department: branch,
//   "years.year": year,
// });

// if (!academic) {
//   console.warn("Academic structure not found");
//   return;
// }

// const yearBlock = academic.years.find(y => y.year === year);
// const targetDiv = yearBlock.divisions.find(div => div.students.length < 50);

// if (!targetDiv) {
//   console.warn("No division with < 50 students found");
//   return;
// }

// // Now update that specific division:
// await academicSchema.updateOne(
//   {
//     department: branch,
//     "years.year": year,
//     "years.divisions.divisionName": targetDiv.divisionName,
//   },
//   {
//     $addToSet: {
//       "years.$[yearElem].divisions.$[div].students": student._id,
//     },
//   },
//   {
//     arrayFilters: [
//       { "yearElem.year": year },
//       { "div.divisionName": targetDiv.divisionName }
//     ],
//   }
// );

 
// }

import { connectToDatabase } from "../../../lib/mongodb";
import admissionSchema from "../../../models/admissionSchema";
import studentSchema from "../../../models/studentSchema";
import academicSchema from "../../../models/academicSchema";
import mongoose from 'mongoose';

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { id: admissionId } = params;
    const updateData = await req.json();

    // Validate admission ID
    if (!mongoose.Types.ObjectId.isValid(admissionId)) {
      return Response.json(
        { success: false, message: "Invalid admission ID format" },
        { status: 400 }
      );
    }

    // Validate update data
    if (!updateData || typeof updateData !== "object" || Object.keys(updateData).length === 0) {
      return Response.json(
        { success: false, message: "Missing or invalid update data" },
        { status: 400 }
      );
    }

    // Prevent updating certain fields
    const restrictedFields = ["_id", "enquiryId", "counsellorId", "createdAt", "prn"];
    for (const field of restrictedFields) {
      if (field in updateData) {
        delete updateData[field];
      }
    }

    // Check current admission status
    const currentAdmission = await admissionSchema.findById(admissionId);
    if (!currentAdmission) {
      return Response.json(
        { success: false, message: "Admission not found" },
        { status: 404 }
      );
    }

    // Prevent downgrading from approved/rejected to inProcess
    if (updateData.status && 
        (currentAdmission.status === 'approved' || currentAdmission.status === 'rejected') && 
        updateData.status === 'inProcess') {
      return Response.json(
        { success: false, message: "Cannot revert approved/rejected admission to inProcess" },
        { status: 400 }
      );
    }

    // Update admission record
    const updatedAdmission = await admissionSchema.findByIdAndUpdate(
      admissionId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    // Handle status change to 'approved'
    if (updateData.status === "approved") {
      try {
        await handleApprovedStatus(updatedAdmission);
      } catch (error) {
        console.error("Error in handleApprovedStatus:", error);
        // Rollback admission status if student creation fails
        await admissionSchema.findByIdAndUpdate(
          admissionId,
          { $set: { status: "inProcess" } }
        );
        throw error;
      }
    }

    return Response.json({
      success: true,
      message: "Admission updated successfully",
      data: updatedAdmission,
    });
  } catch (error) {
    console.error("Admission PUT error:", error);

    // Handle specific error cases
    let status = 500;
    let message = "Server error during update";
    let errors = null;

    if (error.name === "ValidationError") {
      status = 400;
      message = "Validation failed";
      errors = Object.values(error.errors).map((err) => err.message);
    } else if (error.code === 11000) {
      status = 409;
      message = "Duplicate value error";
    }

    return Response.json({ success: false, message, errors }, { status });
  }
}

async function handleApprovedStatus(admission) {
  const {
    _id: admissionId,
    programType,
    year,
    branch,
    fullName,
    email,
    studentWhatsappNumber,
    dateOfBirth,
    address,
    isForeignNational,
    nationality,
    gender,
    prn,
    counsellorId,
    motherName,
    fatherGuardianWhatsappNumber,
    motherMobileNumber,
    casteAsPerLC,
    domicile,
    religionAsPerLC,
    familyIncome,
    admissionYear,
    seatType,
    admissionCategoryDTE,
    feesCategory,
    admissionType
  } = admission;

  // Validate required fields for student creation
  const requiredFields = {
    programType,
    year,
    branch,
    fullName,
    email,
    studentWhatsappNumber,
    dateOfBirth,
    nationality
  };

  for (const [field, value] of Object.entries(requiredFields)) {
    if (!value) {
      throw new Error(`Missing required field for student creation: ${field}`);
    }
  }

  // Check if student already exists for this admission
  const existingStudent = await studentSchema.findOne({ admissionId });
  if (existingStudent) {
    console.log(`Student already exists for admission ${admissionId}`);
    return existingStudent;
  }

  // Generate student ID (format: YYBRANCH####)
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const branchCode = branch.substring(0, 3).toUpperCase();
  const studentCount = await studentSchema.countDocuments({ branch });
  const studentId = `${currentYear}${branchCode}${String(studentCount + 1).padStart(4, '0')}`;

  // Create comprehensive student record
  const studentData = {
    studentId,
    admissionId,
    fullName,
    email: email.toLowerCase(),
    mobileNumber: studentWhatsappNumber,
    dateOfBirth,
    gender,
    address: address?.[0] || {},
    nationality,
    isForeignNational: isForeignNational || false,
    status: 'active',
    programType,
    currentYear: year,
    branch,
    prn: prn || generatePRN(branch, currentYear),
    counsellorId,
    motherName,
    fatherMobileNumber: fatherGuardianWhatsappNumber,
    motherMobileNumber,
    caste: casteAsPerLC,
    domicile,
    religion: religionAsPerLC,
    familyIncome,
    admissionYear,
    seatType,
    admissionCategory: admissionCategoryDTE,
    feesCategory,
    admissionType
  };

  console.log(studentData);
  
  const student = await studentSchema.create(studentData);

  // Add student to academic structure
  await addStudentToAcademicStructure(student, branch, year, programType);

  return student;
}

function generatePRN(branch, year) {
  const branchCode = branch.substring(0, 3).toUpperCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `PRN${year}${branchCode}${randomNum}`;
}

async function addStudentToAcademicStructure(student, branch, year, programType) {
  // Find or create academic record for this branch and program type
  let academicRecord = await academicSchema.findOne({ 
    department: branch,
    programType: programType
  });

  if (!academicRecord) {
    // Create new academic record if doesn't exist
    academicRecord = await academicSchema.create({
      department: branch,
      programType: programType,
      years: [{
        year,
        divisions: [{
          name: 'A',
          students: [student._id],
          subjects: [],
          timetable: [],
          exams: [],
          attendance: []
        }]
      }]
    });
    return;
  }

  // Find the year block or create it
  let yearBlock = academicRecord.years.find(y => y.year === year);
  
  if (!yearBlock) {
    // Add new year if it doesn't exist
    await academicSchema.findByIdAndUpdate(
      academicRecord._id,
      {
        $push: {
          years: {
            year,
            divisions: [{
              name: 'A',
              students: [student._id],
              subjects: [],
              timetable: [],
              exams: [],
              attendance: []
            }]
          }
        }
      }
    );
    return;
  }

  // Find a division with available space (max 50 students)
  let targetDivision = yearBlock.divisions.find(div => div.students.length < 50);
  
  if (!targetDivision) {
    // Create new division if all are full (A, B, C, etc.)
    const newDivisionName = String.fromCharCode(65 + yearBlock.divisions.length);
    await academicSchema.findByIdAndUpdate(
      academicRecord._id,
      {
        $push: {
          "years.$[yearElem].divisions": {
            name: newDivisionName,
            students: [student._id],
            subjects: [],
            timetable: [],
            exams: [],
            attendance: []
          }
        }
      },
      {
        arrayFilters: [{ "yearElem.year": year }]
      }
    );
  } else {
    // Add student to existing division
    await academicSchema.updateOne(
      {
        _id: academicRecord._id,
        "years.year": year,
        "years.divisions.name": targetDivision.name
      },
      {
        $addToSet: {
          "years.$[yearElem].divisions.$[div].students": student._id
        }
      },
      {
        arrayFilters: [
          { "yearElem.year": year },
          { "div.name": targetDivision.name }
        ]
      }
    );
  }
}

// ... (keep your existing DELETE, POST, and GET methods)

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const { id: admissionId } = params;

    // Validate admission ID
    if (!mongoose.Types.ObjectId.isValid(admissionId)) {
      return Response.json(
        { success: false, message: "Invalid admission ID format" },
        { status: 400 }
      );
    }

    // Check for existing student record
    const existingStudent = await studentSchema.findOne({ admissionId });
    if (existingStudent) {
      return Response.json(
        {
          success: false,
          message: "Cannot delete admission - student record exists",
          studentId: existingStudent.studentId,
        },
        { status: 400 }
      );
    }

    // Perform deletion
    const deletedAdmission = await admissionSchema.findByIdAndDelete(
      admissionId
    );

    if (!deletedAdmission) {
      return Response.json(
        { success: false, message: "Admission not found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Admission deleted successfully",
        data: {
          _id: deletedAdmission._id,
          fullName: deletedAdmission.fullName,
          status: deletedAdmission.status,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admission DELETE error:", error);
    return Response.json(
      {
        success: false,
        message: "Server error during deletion",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

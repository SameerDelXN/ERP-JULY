import { connectToDatabase } from '../../../lib/mongodb';
import admissionSchema from '../../../models/admissionSchema';

// PUT - Update admission by ID (from params)
import studentSchema from '../../../models/studentSchema';
import academicSchema from '../../../models/academicSchema';
import { NextResponse } from 'next/server';
// kanika
// export async function PUT(req, { params }) {
//   try {
//     await connectToDatabase();
//     const updateData = await req.json();
//     const { id: admissionId } = params;

//     console.log(updateData)
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
//     console.log(updatedAdmission)
//     if (!updatedAdmission) {
//       return new Response(JSON.stringify({ message: 'Admission not found' }), { status: 404 });
//     }

//     // 2. Only proceed if status is approved
//     if (updateData.status === 'approved') {
//       const department = updatedAdmission.branch; // department = courseName
//       const year = updatedAdmission.year; // e.g. "1st Year"
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

// import { connectToDatabase } from '../../../lib/mongodb';
// import admissionSchema from '../../../models/admissionSchema';
// import studentSchema from '../../../models/studentSchema';
// import academicSchema from '../../../models/academicSchema';

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const {id} = await params;
    const admissionId =id; // Get id directly from params
    const updateData = await req.json();

    if (!updateData || typeof updateData !== 'object' || Object.keys(updateData).length === 0) {
      return Response.json(
        { success: false, message: "Missing or invalid update data" },
        { status: 400 }
      );
    }

    // Prevent updating certain fields
    const restrictedFields = ['_id', 'enquiryId', 'counsellorId', 'createdAt'];
    for (const field of restrictedFields) {
      if (field in updateData) {
        delete updateData[field];
      }
    }

    // Update admission record
    const updatedAdmission = await admissionSchema
      .findByIdAndUpdate(
        admissionId,
        { $set: updateData },
        { new: true, runValidators: true }
      )
      .lean();

    if (!updatedAdmission) {
      return Response.json(
        { success: false, message: 'Admission not found' },
        { status: 404 }
      );
    }

    // Handle status change to 'approved'
    if (updateData.status === 'approved') {
      const { 
        programType, 
        year, 
        branch,
        fullName,
        email,
        studentWhatsappNumber,
        dateOfBirth,
        address,
        isForeignNational,
        nationality
      } = updatedAdmission;

      // Validate required fields for student creation
      if (!programType || !year || !branch) {
        return Response.json(
          { 
            success: false, 
            message: 'Missing academic details (programType, year, or branch) required for student creation' 
          },
          { status: 400 }
        );
      }

      // Check/create student record
      let student = await studentSchema.findOne({ admissionId });

      if (!student) {
        const studentCount = await studentSchema.countDocuments();
        const studentId = `SCH${new Date().getFullYear()}-${String(studentCount + 1).padStart(4, '0')}`;

        student = await studentSchema.create({
          studentId,
          admissionId,
          fullName,
          email: email.toLowerCase(),
          mobileNumber: studentWhatsappNumber,
          dateOfBirth,
          address: address?.[0] || {},
          nationality,
          isForeignNational: isForeignNational || false,
          status: 'active',
          programType,
          currentYear: year,
          branch
        });
      }

      // Update academic record - fixed version
      const academicUpdate = await academicSchema.findOneAndUpdate(
        { 
          department: branch,
          'years.year': year
        },
        { 
          $addToSet: { 
            'years.$[yearElem].divisions.$[div].students': student._id 
          } 
        },
        { 
          arrayFilters: [
            { 'yearElem.year': year },
            { 'div.students.50': { $exists: false } } // Alternative way to check size
          ],
          new: true
        }
      );

      if (!academicUpdate) {
        console.warn(`No available division found for branch ${branch} and year ${year}`);
      }
    }

    return Response.json(
      {
        success: true,
        message: 'Admission updated successfully',
        data: updatedAdmission
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Admission PUT error:', error);
    
    if (error.name === 'ValidationError') {
      return Response.json(
        { 
          success: false,
          message: 'Validation failed',
          errors: Object.values(error.errors).map(err => err.message)
        },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return Response.json(
        { 
          success: false,
          message: 'Duplicate value error',
          field: Object.keys(error.keyPattern)[0]
        },
        { status: 409 }
      );
    }

    return Response.json(
      {
        success: false,
        message: 'Server error during update',
        error: error.message
      },
      { status: 500 }
    );
  }
}
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


// New Added For API route to fetch individual admission records: CK

export async function GET(request, { params }) {
  try {
    const {id}  = params;

    console.log("From ID page",id);
    
    
    const admission = await admissionSchema.findById(id);
    if (!admission) {
      return NextResponse.json(
        { success: false, error: "Admission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: admission });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
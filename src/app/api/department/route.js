// api for admin to create department and assign HOD

// src/app/api/department/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import academicSchema from '../../models/academicSchema';
import teacherSchema from '../../models/teacherSchema';

async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
}

export async function POST(request) {
  try {
    await connectDB();
    const { departmentName, hodId } = await request.json();

    if (!departmentName || !hodId) {
      return NextResponse.json(
        { error: 'Department name and HOD ID are required' },
        { status: 400 }
      );
    }

    // Check if department already exists
    const existingDepartment = await academicSchema.findOne({ department: departmentName });
    if (existingDepartment) {
      return NextResponse.json(
        { error: 'Department already exists' },
        { status: 400 }
      );
    }

    // Check if teacher exists
    const teacher = await teacherSchema.findById(hodId);
    if (!teacher) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      );
    }

    // Check if teacher is already a HOD
    if (teacher.department && teacher.role === 'HOD') {
      return NextResponse.json(
        { error: 'Teacher is already HOD of another department' },
        { status: 400 }
      );
    }

    // Start transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create new department
      const newDepartment = new academicSchema({
        department: departmentName,
        divisions: []
      });

      await newDepartment.save({ session });

      // Update teacher as HOD
      await teacherSchema.findByIdAndUpdate(
        hodId,
        { department: departmentName, role: 'HOD' },
        { session }
      );

      await session.commitTransaction();
      return NextResponse.json({
        message: 'Department created and HOD assigned successfully',
        department: {
          id: newDepartment._id,
          name: departmentName,
          hod: {
            id: teacher._id,
            name: teacher.fullName,
            email: teacher.email
          }
        }
      }, { status: 201 });

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

  } catch (error) {
    console.error('Error creating department:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// // GET - Fetch all departments
// export async function GET() {
//   try {
//     await connectDB();
    
//     const departments = await Academic.find({})
//       .select('department year divisions')
//       .lean();
    
//     // Get HOD details for each department
//     const departmentsWithHOD = await Promise.all(
//       departments.map(async (dept) => {
//         const hod = await Teacher.findOne({ 
//           department: dept.department, 
//           role: 'HOD' 
//         }).select('fullName email teacherId');
        
//         return {
//           id: dept._id,
//           name: dept.department,
//           year: dept.year,
//           divisionsCount: dept.divisions.length,
//           hod: hod ? {
//             id: hod._id,
//             name: hod.fullName,
//             email: hod.email,
//             teacherId: hod.teacherId
//           } : null
//         };
//       })
//     );
    
//     return NextResponse.json({
//       departments: departmentsWithHOD
//     });
    
//   } catch (error) {
//     console.error('Error fetching departments:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// // PUT - Update department (change HOD)
// export async function PUT(request) {
//   try {
//     await connectDB();
    
//     const { departmentId, newHodId } = await request.json();
    
//     if (!departmentId || !newHodId) {
//       return NextResponse.json(
//         { error: 'Department ID and new HOD ID are required' },
//         { status: 400 }
//       );
//     }

//     // Find the department
//     const department = await Academic.findById(departmentId);
//     if (!department) {
//       return NextResponse.json(
//         { error: 'Department not found' },
//         { status: 404 }
//       );
//     }

//     // Find new teacher
//     const newHod = await Teacher.findById(newHodId);
//     if (!newHod) {
//       return NextResponse.json(
//         { error: 'New HOD not found' },
//         { status: 404 }
//       );
//     }

//     // Check if new HOD is already assigned elsewhere
//     if (newHod.department && newHod.role === 'HOD') {
//       return NextResponse.json(
//         { error: 'Teacher is already HOD of another department' },
//         { status: 400 }
//       );
//     }

//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//       // Remove HOD role from current HOD
//       await Teacher.updateOne(
//         { department: department.department, role: 'HOD' },
//         { 
//           department: null, 
//           role: 'teacher' 
//         },
//         { session }
//       );

//       // Assign new HOD
//       await Teacher.findByIdAndUpdate(
//         newHodId,
//         {
//           department: department.department,
//           role: 'HOD'
//         },
//         { session }
//       );

//       await session.commitTransaction();
      
//       return NextResponse.json({
//         message: 'HOD updated successfully',
//         department: {
//           id: department._id,
//           name: department.department,
//           newHod: {
//             id: newHod._id,
//             name: newHod.fullName,
//             email: newHod.email
//           }
//         }
//       });

//     } catch (error) {
//       await session.abortTransaction();
//       throw error;
//     } finally {
//       session.endSession();
//     }

//   } catch (error) {
//     console.error('Error updating department HOD:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// // DELETE - Remove department
// export async function DELETE(request) {
//   try {
//     await connectDB();
    
//     const { searchParams } = new URL(request.url);
//     const departmentId = searchParams.get('id');
    
//     if (!departmentId) {
//       return NextResponse.json(
//         { error: 'Department ID is required' },
//         { status: 400 }
//       );
//     }

//     // Find the department
//     const department = await Academic.findById(departmentId);
//     if (!department) {
//       return NextResponse.json(
//         { error: 'Department not found' },
//         { status: 404 }
//       );
//     }

//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//       // Remove HOD assignment
//       await Teacher.updateOne(
//         { department: department.department, role: 'HOD' },
//         { 
//           department: null, 
//           role: 'teacher' 
//         },
//         { session }
//       );

//       // Delete department
//       await Academic.findByIdAndDelete(departmentId, { session });

//       await session.commitTransaction();
      
//       return NextResponse.json({
//         message: 'Department deleted successfully'
//       });

//     } catch (error) {
//       await session.abortTransaction();
//       throw error;
//     } finally {
//       session.endSession();
//     }

//   } catch (error) {
//     console.error('Error deleting department:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }
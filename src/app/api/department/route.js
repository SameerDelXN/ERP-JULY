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

    // Validate input
    if (!departmentName || !hodId) {
      return NextResponse.json(
        {
          error: 'Department name and HOD ID are required'
        },
        {
          status: 400
        }
      );
    }

    // Check if department already exists
    const existingDepartment = await academicSchema.findOne({ department: departmentName });
    if (existingDepartment) {
      return NextResponse.json(
        {
          error: 'Department already exists'
        },
        {
          status: 400
        }
      );
    }

    // Check if HOD exists
    const teacher = await teacherSchema.findById(hodId);
    if (!teacher) {
      return NextResponse.json(
        {
          error: 'Teacher not found'
        },
        {
          status: 404
        }
      );
    }

    // Prevent assigning HOD if already one
    if (teacher.department && teacher.role === 'HOD') {
      return NextResponse.json(
        {
          error: 'Teacher is already a HOD of another department'
        },
        {
          status: 400
        }
      );
    }

    // Start transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create department with empty years array
      const newDepartment = new academicSchema({
        department: departmentName,
        years: [], // Initially empty
      });

      await newDepartment.save({ session });

      // Update teacher role to HOD
      await teacherSchema.findByIdAndUpdate(
        hodId,
        {
          department: departmentName,
          role: 'HOD'
        },
        {
          session
        }
      );

      await session.commitTransaction();
      session.endSession();

      return NextResponse.json(
        {
          message: 'Department created and HOD assigned successfully',
          department: {
            id: newDepartment._id,
            name: departmentName,
            hod: {
              id: teacher._id,
              name: teacher.fullName,
              email: teacher.email,
            },
          },
        },
        {
          status: 201
        }
      );
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  } catch (error) {
    console.error('Error creating department:', error);
    return NextResponse.json(
      {
        error: 'Internal server error'
      },
      {
        status: 500
      }
    );
  }
}


export async function GET() {
  try {
    await connectDB();

    // Fetch all departments
    const departments = await academicSchema.find({});

    // Enrich each department with HOD info and include `year`
    const enrichedDepartments = await Promise.all(
      departments.map(async (dept) => {
        const hod = await teacherSchema.findOne({
          department: dept.department,
          role: 'HOD'
        });
        return {
          id: dept._id,
          department: dept.department,
          year: dept.year || null, // Include year, even if null
          divisions: dept.divisions || [],
          hod: hod
            ? {
              id: hod._id,
              fullName: hod.fullName,
              email: hod.email,
              teacherId: hod.teacherId,
            }
            : null,
        };
      })
    );

    return NextResponse.json({
      departments: enrichedDepartments
    }, {
      status: 200
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      {
        error: 'Internal server error'
      },
      {
        status: 500
      }
    );
  }
}
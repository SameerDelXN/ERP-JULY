// /api/addApprovedStudentToDivision.js

import { connectToDatabase } from '../../lib/mongodb';
import admissionSchema from '../../models/admissionSchema';
import studentSchema from '../../models/studentSchema';
import academicSchema from '../../models/academicSchema';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const { admissionId, department, divisionName } = body;

    if (!admissionId || !department || !divisionName) {
      return NextResponse.json(
        {
          error: 'admissionId, department, and divisionName are required'
        },
        {
          status: 400
        }
      );
    }

    // 1. Fetch approved admission
    const admission = await admissionSchema.findOne({ _id: admissionId, status: 'approved' });
    if (!admission) {
      return NextResponse.json({
        error: 'Approved admission not found'
      }, {
        status: 404
      });
    }

    // 2. Check if student already exists
    let student = await studentSchema.findOne({
      admissionId: admission._id
    });

    // 3. If not, create a new student
    if (!student) {
      const studentCount = await studentSchema.countDocuments();
      const paddedNumber = String(studentCount + 1).padStart(3, '0');
      const currentYear = new Date().getFullYear();
      const studentId = `SCH${currentYear}-${paddedNumber}`;

      student = await studentSchema.create({
        studentId,
        admissionId: admission._id,
        status: 'active',
      });
    }

    // 4. Find Academic Record (for department + 1st Year)
    const academic = await academicSchema.findOne({
      department,
      year: '1st Year',
    });

    if (!academic) {
      return NextResponse.json({
        error: 'Academic record not found for department and year'
      }, {
        status: 404
      });
    }

    // 5. Find division
    const division = academic.divisions.find(div => div.name === divisionName);
    if (!division) {
      return NextResponse.json({
        error: `Division ${divisionName} not found`
      }, {
        status: 404
      });
    }

    // 6. Check if already added
    if (division.students.some(id => id.equals(student._id))) {
      return NextResponse.json({
        message: 'Student already assigned to this division',
        student: {
          studentId: student.studentId,
          admissionId: student.admissionId,
        },
      }, {
        status: 200
      });
    }

    // 7. Check capacity
    if (division.students.length >= 50) {
      return NextResponse.json({
        error: 'Division has reached the 50 student limit'
      }, {
        status: 400
      });
    }

    // 8. Add student to division
    division.students.push(student._id);
    await academic.save();

    return NextResponse.json({
      message: 'Student added to academic division successfully',
      student: {
        studentId: student.studentId,
        admissionId: student.admissionId,
      },
    }, {
      status: 201
    });

  } catch (err) {
    console.error('Error adding student:', err);
    return NextResponse.json({
      error: 'Internal Server Error'
    }, {
      status: 500
    });
  }
}

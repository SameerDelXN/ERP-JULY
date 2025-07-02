//hod can view academics of his/her department only 

import { connectToDatabase } from '../../../../lib/mongodb';
import teacherSchema from '../../../../models/teacherSchema';
import mongoose from 'mongoose';
import userSchema from '../../../../models/userSchema';
import academicSchema from '../../../../models/academicSchema';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const hodId = params.id;

    // ✅ Find the HOD by ID and validate role
    const hod = await teacherSchema.findById(hodId);
    if (!hod || hod.role !== 'HOD') {
      return NextResponse.json({ error: 'HOD not found or invalid role' }, { status: 404 });
    }

    const department = hod.department;

    // ✅ Get all academic data for the department
    const academics = await academicSchema.find({ department });

    return NextResponse.json({
      message: 'Academic data fetched successfully',
      department,
      academics,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching academic data for HOD:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


// POST route handler so that hod can add functions yr, subjects, division

export async function POST(request, { params }) {
  try {
    await connectToDatabase();

    const { id } = params; // HOD ID from URL params
    const body = await request.json();
    const { year, divisions, academicId } = body;
    // Validate request body
    if (!year || !divisions || !academicId) {
      return NextResponse.json(
        { error: 'Year, divisions, and academicId are required' },
        { status: 400 }
      );
    }

    // Validate divisions array
    if (!Array.isArray(divisions) || divisions.length === 0) {
      return NextResponse.json(
        { error: 'Divisions must be a non-empty array' },
        { status: 400 }
      );
    }

    // Find the HOD
    const hod = await teacherSchema.findById(id);
    if (!hod || hod.role !== 'HOD') {
      return NextResponse.json(
        { error: 'Unauthorized: User is not an HOD' },
        { status: 403 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(academicId)) {
      console.error(`Invalid academicId format: ${academicId}`);
      return NextResponse.json(
        { error: 'Invalid academicId format' },
        { status: 400 }
      );
    }


    // Fetch the academic document
    const academic = await academicSchema.findById(academicId);
    console.log("ac - ",academic)
    if (!academic) {
      return NextResponse.json(
        { error: 'Academic record not found' },
        { status: 404 }
      );
    }

    // Now check if HOD belongs to the same department
    if (!hod.department || hod.department.toString() !== academic.department.toString()) {
      return NextResponse.json(
        { error: 'HOD is not assigned to this department' },
        { status: 403 }
      );
    }


    // Update year if provided
    academic.year = year;

    // Validate and update divisions
    for (const division of divisions) {
      // Validate division fields
      if (!division.name || !division.subjects || !division.timetable || !division.exams) {
        return NextResponse.json(
          { error: 'Each division must have name, subjects, timetable, and exams' },
          { status: 400 }
        );
      }

      // Validate subjects
      for (const subject of division.subjects) {
        if (!subject.name || !subject.teacher) {
          return NextResponse.json(
            { error: 'Each subject must have a name and teacher' },
            { status: 400 }
          );
        }
        // Verify teacher exists and is a teacher
        const teacher = await teacherSchema.findById(subject.teacher);
        if (!teacher || teacher.role !== 'teacher') {
          return NextResponse.json(
            { error: `Invalid teacher ID: ${subject.teacher}` },
            { status: 400 }
          );
        }
      }

      // Validate timetable
      for (const slot of division.timetable) {
        if (!slot.day || !slot.period || !slot.subject || !slot.teacher || !slot.time || !slot.time.start || !slot.time.end) {
          return NextResponse.json(
            { error: 'Each timetable slot must have day, period, subject, teacher, and time (start/end)' },
            { status: 400 }
          );
        }
        // Verify teacher exists
        const teacher = await teacherSchema.findById(slot.teacher);
        if (!teacher || teacher.role !== 'teacher') {
          return NextResponse.json(
            { error: `Invalid teacher ID in timetable: ${slot.teacher}` },
            { status: 400 }
          );
        }
      }

      // Validate exams
      for (const exam of division.exams) {
        if (!exam.type || !exam.subject || !exam.totalMarks || !exam.date) {
          return NextResponse.json(
            { error: 'Each exam must have type, subject, totalMarks, and date' },
            { status: 400 }
          );
        }
      }

      // Validate students if provided
      if (division.students) {
        for (const studentId of division.students) {
          const student = await userSchema.findById(studentId);
          if (!student || student.role !== 'student') {
            return NextResponse.json(
              { error: `Invalid student ID: ${studentId}` },
              { status: 400 }
            );
          }
        }
      }

      // Add validated division to academic record
      academic.divisions.push({
        name: division.name,
        students: division.students || [],
        subjects: division.subjects,
        timetable: division.timetable,
        exams: division.exams,
        attendance: division.attendance || [],
      });
    }

    // Save the updated academic record
    await academic.save();

    return NextResponse.json(
      { message: 'Academic data updated successfully', academic },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in POST /api/hod/[id]/academics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

//PUT route handler for HOD to update academics details 


export async function PUT(request, { params }) {
  try {
    await connectToDatabase();

    const { id: hodId } = params;
    const { academicId, year, divisionUpdates } = await request.json();

    if (!academicId) {
      return NextResponse.json({ error: 'academicId is required' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(academicId)) {
      return NextResponse.json({ error: 'Invalid academicId format' }, { status: 400 });
    }

    // 🔍 Validate HOD
    const hod = await teacherSchema.findById(hodId);
    if (!hod || hod.role !== 'HOD') {
      return NextResponse.json({ error: 'Unauthorized: Not a valid HOD' }, { status: 403 });
    }

    const academic = await academicSchema.findById(academicId);
    if (!academic) {
      return NextResponse.json({ error: 'Academic record not found' }, { status: 404 });
    }

    if (hod.department !== academic.department) {
      return NextResponse.json({ error: 'HOD not authorized for this department' }, { status: 403 });
    }

    // ✅ Update year if provided
    if (year) {
      academic.year = year;
    }

    // ✅ Process division updates
    if (Array.isArray(divisionUpdates)) {
      for (const update of divisionUpdates) {
        const { name, subjects, timetable, exams, students } = update;

        const division = academic.divisions.find((d) => d.name === name);
        if (!division) {
          return NextResponse.json({ error: `Division ${name} not found` }, { status: 404 });
        }

        // Update subjects if provided
        if (subjects) {
          for (const subject of subjects) {
            if (!subject.name || !subject.teacher) {
              return NextResponse.json({ error: 'Each subject must have name and teacher' }, { status: 400 });
            }

            const teacher = await teacherSchema.findById(subject.teacher);
            if (!teacher || teacher.role !== 'teacher') {
              return NextResponse.json({ error: `Invalid teacher ID: ${subject.teacher}` }, { status: 400 });
            }
          }
          division.subjects = subjects;
        }

        // Update timetable if provided
        if (timetable) {
          for (const slot of timetable) {
            if (!slot.day || !slot.period || !slot.subject || !slot.teacher || !slot.time?.start || !slot.time?.end) {
              return NextResponse.json(
                { error: 'Each timetable slot must have complete details' },
                { status: 400 }
              );
            }

            const teacher = await teacherSchema.findById(slot.teacher);
            if (!teacher || teacher.role !== 'teacher') {
              return NextResponse.json({ error: `Invalid teacher ID in timetable: ${slot.teacher}` }, { status: 400 });
            }
          }
          division.timetable = timetable;
        }

        // Update exams if provided
        if (exams) {
          for (const exam of exams) {
            if (!exam.type || !exam.subject || !exam.totalMarks || !exam.date) {
              return NextResponse.json({ error: 'Each exam must have full details' }, { status: 400 });
            }
          }
          division.exams = exams;
        }

        // Update students if provided
        if (students) {
          for (const studentId of students) {
            const student = await userSchema.findById(studentId);
            if (!student || student.role !== 'student') {
              return NextResponse.json({ error: `Invalid student ID: ${studentId}` }, { status: 400 });
            }
          }

          if (students.length > 50) {
            return NextResponse.json({ error: 'A division cannot have more than 50 students' }, { status: 400 });
          }

          division.students = students;
        }
      }
    }

    await academic.save();

    return NextResponse.json(
      { message: 'Academic details updated successfully', academic },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in PUT /api/hod/[id]/academics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}



//
export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();

    const { id: hodId } = params;
    const { academicId } = await request.json();

    // Validate academicId
    if (!academicId || !mongoose.Types.ObjectId.isValid(academicId)) {
      return NextResponse.json({ error: 'Invalid or missing academicId' }, { status: 400 });
    }

    // ✅ Verify HOD
    const hod = await teacherSchema.findById(hodId);
    if (!hod || hod.role !== 'HOD') {
      return NextResponse.json({ error: 'Unauthorized: Not a valid HOD' }, { status: 403 });
    }

    // ✅ Find academic record
    const academic = await academicSchema.findById(academicId);
    if (!academic) {
      return NextResponse.json({ error: 'Academic record not found' }, { status: 404 });
    }

    // ✅ Check HOD belongs to same department
    if (academic.department !== hod.department) {
      return NextResponse.json({ error: 'HOD not authorized for this department' }, { status: 403 });
    }

    // ✅ Delete academic record
    await academicSchema.findByIdAndDelete(academicId);

    return NextResponse.json(
      { message: 'Academic record deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/hod/[id]/academics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
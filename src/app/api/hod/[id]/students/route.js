import { Types } from 'mongoose';
import mongoose from 'mongoose';
import { connectToDatabase } from '../../../../lib/mongodb';
import attendanceSchema from '../../../../models/attendanceSchema';
import studentSchema from '../../../../models/studentSchema';
import teacherSchema from '../../../../models/teacherSchema';
import academicSchema from '../../../../models/academicSchema';
import userSchema from '../../../../models/userSchema'; // Assuming HOD is in 'User' model
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    const { id } = params;

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid HOD ID' }, { status: 400 });
    }

    // Step 1: Get HOD's department from User model
    const hod = await teacherSchema.findById(id).lean();

    if (!hod || !hod.department) {
      return NextResponse.json({ message: 'HOD or department not found' }, { status: 404 });
    }

    // Step 2: Get ALL students from Student collection for this department
    const allDepartmentStudents = await studentSchema.find({ 
      branch: { $regex: new RegExp(`^${hod.department}$`, 'i') }
    })
    .select('fullName studentId email status currentYear division')
    .lean();

    console.log('All department students from Student collection:', allDepartmentStudents.length);

    // Step 3: Also get academic structure for attendance data
    const academicDoc = await academicSchema.findOne({ department: hod.department })
      .populate({
        path: 'years.divisions.students',
        model: studentSchema,
        select: 'fullName studentId email',
      })
      .lean();

    // Step 4: Fetch attendance records
    const attendanceRecords = await attendanceSchema.find({
      department: academicDoc?.department || hod.department,
    }).lean();

    // Step 5: Create comprehensive student data
    let allStudents = [];
    
    if (allDepartmentStudents.length > 0) {
      // Use students from Student collection (primary source)
      allStudents = allDepartmentStudents.map(student => ({
        id: student._id,
        name: student.fullName || 'Unnamed',
        roll: student.studentId || 'N/A',
        email: student.email || '',
        status: student.status || 'active',
        currentYear: student.currentYear || '1st Year',
        division: student.division || 'A',
        attendance: {} // Will be populated if attendance data exists
      }));
    } else if (academicDoc) {
      // Fallback to academic structure if no students in Student collection
      allStudents = [];
      academicDoc.years.forEach((year) => {
        year.divisions.forEach((division) => {
          if (division.students && division.students.length > 0) {
            division.students.forEach((stu) => {
              allStudents.push({
                id: stu._id,
                name: stu.fullName || 'Unnamed',
                roll: stu.studentId || 'N/A',
                email: stu.email || '',
                status: 'active',
                currentYear: year.year,
                division: division.name,
                attendance: buildStudentAttendance(
                  attendanceRecords,
                  year.year,
                  year.semester,
                  division.name,
                  stu._id
                ),
              });
            });
          }
        });
      });
    }

    console.log('Final student count for student management:', allStudents.length);

    // Step 6: Group by year for frontend compatibility
    const studentsByYear = {};
    allStudents.forEach(student => {
      const yearKey = student.currentYear || '1st Year';
      if (!studentsByYear[yearKey]) {
        studentsByYear[yearKey] = [];
      }
      
      // Check if division already exists for this year
      let division = studentsByYear[yearKey].find(d => d.division === student.division);
      if (!division) {
        division = {
          division: student.division,
          students: []
        };
        studentsByYear[yearKey].push(division);
      }
      
      division.students.push(student);
    });

    // Step 7: Transform data to match expected format
    const transformed = {
      years: Object.keys(studentsByYear).map(year => ({
        year: year,
        semester: 'Sem 1', // Default semester
        divisions: studentsByYear[year]
      }))
    };

    return NextResponse.json(transformed, { status: 200 });

  } catch (error) {
    console.error('Error fetching academic data:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// ➤ Build subject-wise attendance percentages
function buildStudentAttendance(attendanceRecords, year, semester, division, studentId) {
  const subjectMap = {};

  attendanceRecords
    .filter(record =>
      record.year === year &&
      record.semester === semester &&
      record.division === division
    )
    .forEach(record => {
      const subject = record.subject || 'Unknown Subject';
      const studentEntry = record.students.find(s => s.studentId?.toString() === studentId.toString());
      if (!studentEntry) return;

      if (!subjectMap[subject]) subjectMap[subject] = { total: 0, present: 0 };

      subjectMap[subject].total += 1;
      if (studentEntry.isPresent) {
        subjectMap[subject].present += 1;
      }
    });

  const percentageMap = {};
  for (const subject in subjectMap) {
    const { total, present } = subjectMap[subject];
    percentageMap[subject] = total > 0 ? Math.round((present / total) * 100) : 0;
  }

  return percentageMap;
}

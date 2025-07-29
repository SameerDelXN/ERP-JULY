// import { connectToDatabase } from "../../../../lib/mongodb";
// import academicSchema from "../../../../models/academicSchema";
// import studentSchema from "../../../../models/studentSchema";
// import { NextResponse } from "next/server";

// // GET /api/teachers/[id]/students
// export async function GET(req, { params }) {
//   await connectToDatabase();

//   try {
//     const teacherId = params.id;

//     // Find all academic records where this teacher teaches any subject
//     const academicRecords = await academicSchema.find({
//       "years.divisions.subjects.teacher": teacherId
//     }).populate({
//       path: "years.divisions.students",
//       model: studentSchema,
//       select: "fullName email prn studentId"
//     });

//     if (!academicRecords || academicRecords.length === 0) {
//       return NextResponse.json(
//         { message: "No students found for this teacher" },
//         { status: 404 }
//       );
//     }

//     // Extract students from these records
//     const studentsByTeacher = [];

//     academicRecords.forEach(program => {
//       program.years.forEach(year => {
//         year.divisions.forEach(division => {
//           // Check if this teacher teaches any subject in this division
//           const subjectsTaught = division.subjects.filter(
//             subject => subject.teacher.toString() === teacherId
//           );

//           if (subjectsTaught.length > 0) {
//             // Add all students from this division
//             division.students.forEach(student => {
//               studentsByTeacher.push({
//                 id: student._id,
//                 studentId:student.studentId,
//                 fullName: student.fullName, 
//                 email: student.email,
//                 prn : student.prn,
//                 program: program.programType,
//                 department: program.department,
//                 year: year.year,
//                 semester: year.semester,
//                 division: division.name,
//                 subjects: subjectsTaught.map(subj => subj.name)
//               });
//             });
//           }
//         });
//       });
//     });

//     return NextResponse.json(
//       { 
//         message: "Students fetched successfully",
//         students: studentsByTeacher 
//       }, 
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error("GET error:", error);
//     return NextResponse.json(
//       { message: "Server Error", error: error.message },
//       { status: 500 }
//     );
//   }
// }

import { connectToDatabase } from "../../../../lib/mongodb";
import academicSchema from "../../../../models/academicSchema";
import studentSchema from "../../../../models/studentSchema";
import { NextResponse } from "next/server";

// GET /api/teachers/[id]/students
export async function GET(req, { params }) {
  await connectToDatabase();

  try {
    const teacherId = params.id;
    const { searchParams } = new URL(req.url);
    const divisionFilter = searchParams.get('division');

    // Find all academic records where this teacher teaches any subject
    const academicRecords = await academicSchema.find({
      "years.divisions.subjects.teacher": teacherId
    }).populate({
      path: "years.divisions.students",
      model: studentSchema,
      select: "fullName email prn studentId division status mobileNumber programType"
    });

    if (!academicRecords || academicRecords.length === 0) {
      return NextResponse.json(
        { message: "No students found for this teacher" },
        { status: 404 }
      );
    }

    // Extract students from these records
    const studentsByTeacher = [];

    academicRecords.forEach(program => {
      program.years.forEach(year => {
        year.divisions.forEach(division => {
          // Check if this teacher teaches any subject in this division
          const subjectsTaught = division.subjects.filter(
            subject => subject.teacher.toString() === teacherId
          );

          if (subjectsTaught.length > 0) {
            // Add students from this division (with optional division filter)
            division.students.forEach(student => {
              // Apply division filter if provided
              if (!divisionFilter || division.name === divisionFilter) {
                studentsByTeacher.push({
                  id: student._id,
                  studentId: student.studentId,
                  fullName: student.fullName, 
                  email: student.email,
                  prn: student.prn,
                  program: program.programType,
                  department: program.department,
                  year: year.year,
                  semester: year.semester,
                  division: division.name,
                  status:student.status,
                  mobileNumber:student.mobileNumber,
                  subjects: subjectsTaught.map(subj => subj.name)
                });
              }
            });
          }
        });
      });
    });

    // If division filter was applied but no students found
    if (divisionFilter && studentsByTeacher.length === 0) {
      return NextResponse.json(
        { message: `No students found in division ${divisionFilter}` },
        { status: 404 }
      );
    }

    console.log(studentsByTeacher);
    

    return NextResponse.json(
      { 
        message: "Students fetched successfully",
        students: studentsByTeacher 
      }, 
      { status: 200 }
    );

  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
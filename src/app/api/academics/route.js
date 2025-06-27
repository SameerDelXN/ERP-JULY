// hod functions can add yr, subjects, division

// app/api/academic/route.js

// import { NextResponse } from 'next/server';
// import { connectToDatabase } from '../../lib/mongodb';
// import academicSchema from '../../models/academicSchema';

// export async function POST(req) {
//     try {
//         await connectToDatabase();
//         const body = await req.json();

//         const {
//             year,               // e.g., "Second Year"
//             subjects,           // e.g., [{ name: "Math", code: "MATH101" }, ...]
//             divisions           // e.g., [{ name: "A", classTeacher: "<ObjectId>" }, ...]
//         } = body;

//         // Validate required fields
//         if (!year || !Array.isArray(subjects) || !Array.isArray(divisions)) {
//             return NextResponse.json({ 
//                 error: 'Missing required fields' 
//             }, { 
//                 status: 400 
//             });
//         }

//         // Check for duplicate academic year
//         const existing = await academicSchema.findOne({ year });
//         if (existing) {
//             return NextResponse.json({ 
//                 error: 'Academic year already exists' 
//             }, { 
//                 status: 409 
//             });
//         }

//         const newAcademic = new academicSchema({
//             year,
//             subjects,
//             divisions,
//             // timetable, assignments, attendanceRecords, exams will be empty by default
//         });

//         await newAcademic.save();

//         return NextResponse.json({ 
//             message: 'Academic year created successfully', 
//         }, { 
//             status: 201 
//         });

//     } catch (error) {
//         console.error('Error creating academic year:', error);
//         return NextResponse.json({ 
//             error: 'Internal Server Error' 
//         }, { 
//             status: 500 
//         });
//     }
// }



// src/app/api/academics/route.js

import { connectToDatabase } from '../../lib/mongodb';
import academicSchema from '../../models/academicSchema';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectToDatabase();
    const data = await req.json();

    // Validate required fields
    if (!data.year || !Array.isArray(data.divisions)) {
      return NextResponse.json({ error: 'Missing year or divisions' }, { status: 400 });
    }

    const newAcademic = new academicSchema(data);
    await newAcademic.save();

    return NextResponse.json(
      { message: 'Academic record created successfully', academic: newAcademic },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating academic record:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// hod functions

// app/api/academic/route.js

import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/mongodb';
import academicSchema from '../../models/academicSchema';

export async function POST(req) {
    try {
        await connectToDatabase();
        const body = await req.json();

        const {
            year,               // e.g., "Second Year"
            subjects,           // e.g., [{ name: "Math", code: "MATH101" }, ...]
            divisions           // e.g., [{ name: "A", classTeacher: "<ObjectId>" }, ...]
        } = body;

        // Validate required fields
        if (!year || !Array.isArray(subjects) || !Array.isArray(divisions)) {
            return NextResponse.json({ 
                error: 'Missing required fields' 
            }, { 
                status: 400 
            });
        }

        // Check for duplicate academic year
        const existing = await academicSchema.findOne({ year });
        if (existing) {
            return NextResponse.json({ 
                error: 'Academic year already exists' 
            }, { 
                status: 409 
            });
        }

        const newAcademic = new academicSchema({
            year,
            subjects,
            divisions,
            // timetable, assignments, attendanceRecords, exams will be empty by default
        });

        await newAcademic.save();

        return NextResponse.json({ 
            message: 'Academic year created successfully', 
        }, { 
            status: 201 
        });

    } catch (error) {
        console.error('Error creating academic year:', error);
        return NextResponse.json({ 
            error: 'Internal Server Error' 
        }, { 
            status: 500 
        });
    }
}

// export async function GET() {
//   try {
//     await connectToDatabase();

//     const allAcademicYears = await academicSchema
//       .find({})
//       .populate('divisions.classTeacher', 'fullName email role') // Populate class teacher
//       .populate('timetable.slots.teacher', 'fullName email role') // Populate timetable teacher
//       .populate('attendanceRecords.students.student', 'fullName email') // Populate attendance students
//       .populate('exams.marks.student', 'fullName email'); // Populate exam marks students

//     return NextResponse.json({ data: allAcademicYears }, { status: 200 });

//   } catch (error) {
//     console.error('Error fetching academic records:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }

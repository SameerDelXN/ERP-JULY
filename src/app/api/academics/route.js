// // POST route handler so that hod can add functions yr, subjects, division

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import academicSchema from '../../models/academicSchema';
import userSchema from '../../models/userSchema';
import { connectToDatabase } from '@/lib/mongodb'; // Adjust path to your MongoDB connection utility

export async function POST(request, { params }) {
  try {
    await connectToDatabase();
    
    const { id } = params; // HOD ID from URL params
    const body = await request.json();
    const { year, divisions, departmentId } = body;

    // Validate request body
    if (!year || !divisions || !departmentId) {
      return NextResponse.json(
        { error: 'Year, divisions, and departmentId are required' },
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
    const hod = await userSchema.findById(id);
    if (!hod || hod.role !== 'HOD') {
      return NextResponse.json(
        { error: 'Unauthorized: User is not an HOD' },
        { status: 403 }
      );
    }

    // Find the academic record for the department
    let academic = await academicSchema.findOne({ department: departmentId });
    if (!academic) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      );
    }

    // Verify HOD is assigned to this department
    if (!hod.department || hod.department.toString() !== departmentId) {
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
        const teacher = await userSchema.findById(subject.teacher);
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
        const teacher = await userSchema.findById(slot.teacher);
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
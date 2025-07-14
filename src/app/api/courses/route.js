// app/api/admin/courses/route.js
import { connectToDatabase } from "@/app/lib/mongodb";
import Course from "../../models/course";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const courses = await Course.find().sort({ name: 1 });
    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    
    // Validate required fields
    if (!data.name) {
      return NextResponse.json(
        { error: "Course name is required" },
        { status: 400 }
      );
    }

    const course = new Course(data);
    await course.save();
    
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Course with this name already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
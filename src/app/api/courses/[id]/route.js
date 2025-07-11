// app/api/admin/courses/[id]/route.js
import { connectToDatabase } from "@/app/lib/mongodb";
import Course from "../../../models/course";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const course = await Course.findById(params.id);
    
    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const data = await request.json();
    
    const course = await Course.findByIdAndUpdate(
      params.id,
      data,
      { new: true }
    );
    
    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(course);
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Course with this name already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    
    const course = await Course.findByIdAndDelete(params.id);
    
    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: "Course deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
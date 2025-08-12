// app/api/admin/courses/route.js
import { connectToDatabase } from "@/app/lib/mongodb";
import Academic from "../../models/academicSchema";
import { NextResponse } from "next/server";
import CoursePlan from "@/app/models/coursePlanSchema"

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch only active academics and select both department and programType
    const academics = await Academic.find({ isActive: true })
      .select('department programType')
      .lean(); // Convert to plain JavaScript objects
    
    // Extract unique program types
    const programTypes = [...new Set(academics.map(academic => academic.programType))];
  
    
    // Create courses array with name (department) and programType
    const courses = academics.map(academic => ({
      name: academic.department,
      programType: academic.programType
    }));
    
    
    // Filter out any entries with missing values
    const filteredCourses = courses.filter(
      course => course.name && course.programType
    );
    
    
    // Return the data in the requested structure
    return NextResponse.json({
      programTypes,
      courses: filteredCourses
    });
  } catch (error) {
    console.error('Error fetching academic data:', error);
    return NextResponse.json(
      { error: "Failed to fetch academic data" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();

    // Validate required fields
    if (!body.academicRef || !body.teacherId || !body.subject) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newCoursePlan = new CoursePlan({
      academicRef: body.academicRef,
      teacherId: body.teacherId,
      subject: body.subject,
      branch: body.branch,
      year: body.year,
      division: body.division || "-",
      batch: body.batch || "-",
      loadType: body.loadType,
      coursePlan: body.coursePlan,
    });

    await newCoursePlan.save();

    return NextResponse.json(
      { message: "Course plan created successfully", data: newCoursePlan },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating course plan:", error);
    return NextResponse.json(
      { error: "Failed to create course plan" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "Course plan ID is required" },
        { status: 400 }
      );
    }

    const updatedPlan = await CoursePlan.findByIdAndUpdate(
      body.id,
      {
        coursePlan: body.coursePlan,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedPlan) {
      return NextResponse.json(
        { error: "Course plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Course plan updated successfully", data: updatedPlan },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating course plan:", error);
    return NextResponse.json(
      { error: "Failed to update course plan" },
      { status: 500 }
    );
  }
}
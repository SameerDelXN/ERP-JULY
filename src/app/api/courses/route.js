// app/api/admin/courses/route.js
import { connectToDatabase } from "@/app/lib/mongodb";
import Academic from "../../models/academicSchema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch only active academics and select both department and programType
    const academics = await Academic.find({ isActive: true })
      .select('department programType')
      .lean(); // Convert to plain JavaScript objects
    
    // Extract unique program types
    const programTypes = [...new Set(academics.map(academic => academic.programType))];
    
    console.log(academics);
    
    // Create courses array with name (department) and programType
    const courses = academics.map(academic => ({
      name: academic.department,
      programType: academic.programType
    }));
    
    console.log(courses);
    
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
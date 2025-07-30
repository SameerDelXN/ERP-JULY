
import { connectToDatabase } from "../../../../../lib/mongodb"
import attendanceSchema from "../../../../../models/attendanceSchema"; // Adjust path if needed
import { NextResponse } from "next/server";

// POST /api/teachers/[id]/dashboard/attendance
export async function POST(req, { params }) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const {
      date,
      department,
      year,
      semester,
      division,
      subject,
      topicName,
      students,
    } = body;

    const teacher = params.id;

    if (!date || !Array.isArray(students)) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }


    console.log(department); 
    

    const attendance = new attendanceSchema({
      date,
      department,
      year,
      semester,
      division,
      subject,
      teacher,
      topicName,
      students,
    });

    const saved = await attendance.save();
    console.log("Data saved",saved);
    
    return NextResponse.json({ message: "Attendance recorded", attendance: saved }, { status: 201 });

  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
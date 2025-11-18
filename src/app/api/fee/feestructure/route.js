import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import FeeStructure from "@/app/models/feeStructureSchema";
import academic from "@/app/models/academicSchema";

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch dropdown values
    const academics = await academic.find({ isActive: true }).lean();

    const programTypes = [
      ...new Set(academics.map((a) => a.programType).filter(Boolean)),
    ].map((pt, index) => ({ id: index + 1, name: pt }));

    const departments = [
      ...new Set(academics.map((a) => a.department).filter(Boolean)),
    ].map((dept, index) => ({ id: index + 1, name: dept }));

    let yearCollect = [];
    academics.forEach((a) => {
      if (a.years) {
        a.years.forEach((y) => {
          if (y.year) yearCollect.push(y.year);
        });
      }
    });

    const years = [...new Set(yearCollect)].map((yr, index) => ({
      id: index + 1,
      name: yr,
    }));

    // ✅ Fetch all saved fee structures
    const feeStructures = await FeeStructure.find().lean();

    return NextResponse.json({
      success: true,
      programTypes,
      departments,
      years,
      feeStructures, // ⬅️ Now frontend will receive this
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}


export async function DELETE(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Fee structure ID is required" },
        { status: 400 }
      );
    }

    const deleted = await FeeStructure.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Fee structure not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Fee structure deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE ERROR:", error);

    return NextResponse.json(
      { success: false, error: "Failed to delete fee structure" },
      { status: 500 }
    );
  }
}




export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const { programType, departmentName, year, caste, fees, totalFees } = body;

    const newFee = await FeeStructure.create({
      programType,
      departmentName,
      year,
      caste,
      fees,
      totalFees,
    });

    return NextResponse.json(
      { success: true, message: "Fee saved successfully", data: newFee },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error saving fee:", error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

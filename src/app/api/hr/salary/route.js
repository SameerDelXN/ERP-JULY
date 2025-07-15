import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { Salary } from '@/models/payroll';
import Staff from '@/models/staff';

export async function POST(request) {
  await connectDB();
  const data = await request.json();

  // ✅ Handle Single Salary Insert/Update
  const { staffId, baseSalary, allowances = 0, deductions = 0 } = data;

  if (!staffId || !baseSalary) {
    return NextResponse.json({ success: false, error: 'staffId and baseSalary required' }, { status: 400 });
  }

  try {
    const staff = await Staff.findOne({ staffId });

    if (!staff) {
      return NextResponse.json({ success: false, error: 'Staff not found' }, { status: 404 });
    }

    const extraLeaves = Math.max(0, staff.leaveCount - 10);
    const leaveDeduction = extraLeaves * 1000;
    const totalDeductions = deductions + leaveDeduction;
    const netSalary = baseSalary + allowances - totalDeductions;

    const salary = await Salary.findOneAndUpdate(
      { staffId },
      {
        staffId,
        name: staff.name,
        baseSalary,
        allowances,
        deductions: totalDeductions,
        leaveDeduction,
        netSalary
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ 
      success: true, 
      data: {
        _id: salary._id,
        staffId: salary.staffId,
        name: salary.name,
        baseSalary: salary.baseSalary,
        allowances: salary.allowances,
        deductions: salary.deductions,
        leaveDeduction: salary.leaveDeduction,
        netSalary: salary.netSalary,
        createdAt: salary.createdAt,
        updatedAt: salary.updatedAt,
        
      } 
    });

  } catch (error) {
    console.error("❌ Single Salary Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✅ GET: Fetch All Salaries (with staff name & department from population)
export async function GET() {
  await connectDB();
  const salaries = await Salary.find(); // .populate('staffId') is not needed since staffId is string
  return NextResponse.json({ success: true, data: salaries });
}


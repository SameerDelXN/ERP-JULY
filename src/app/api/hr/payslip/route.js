import { NextResponse } from 'next/server';
//import mongoose from 'mongoose';
//import connectDB from '@/lib/mongoose';
import { connectToDatabase } from '@/app/lib/mongodb';
import { Salary, Payslip } from '@/models/payroll';
import Staff from '@/models/staff';


export async function POST(req) {
  await connectToDatabase();
  try {
    const { staffId, month } = await req.json();

    // 1. Get salary for that staff and month
    const salary = await Salary.findOne({ staffId, month });
    if (!salary) {
      return NextResponse.json({ success: false, message: 'Salary not found' });
    }

    // 2. Get staff info to fetch leaveCount
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return Response.json({ success: false, message: 'Staff not found' }, { status: 404 });
    }

    const leaveCount = staff.leaveCount || 0;
    let penalty = 0;

    // 3. Apply penalty if leaveCount > 10
    if (leaveCount > 10) {
      const extraLeaves = leaveCount - 10;
      penalty = extraLeaves * 1000;
    }

    const totalDeductions = (salary.deductions || 0) + penalty;
    const finalNetSalary = salary.netSalary - penalty;

    // 4. Create payslip with penalty deducted
    const payslip = await Payslip.create({
      staffId,
      month,
      year: new Date().getFullYear(), // You can adjust this logic
      earnings: {
        basic: salary.basic,
        hra: salary.hra,
        da: salary.da,
        specialAllowance: salary.specialAllowance,
        bonus: salary.bonus,
        other: salary.other || 0
      },
      deductions: {
        pf: salary.pf || 0,
        tds: salary.tds || 0,
        loan: salary.loan || 0,
        leave: penalty,
        other: salary.otherDeductions || 0
      },
      grossEarnings: salary.grossEarnings,
      totalDeductions,
      netSalary: finalNetSalary,
      paymentStatus: 'Pending'
    });

    //await payslip.save();

    return NextResponse.json({ success: true, message: 'Payslip generated successfully', payslip });
  } catch (err) {
    console.error('Payslip generation error:', err);
    return NextResponse.json({ success: false, error: err.message },{ status: 500 });
  }
}

export async function GET() {
  await connectToDatabase();

  try {
    const staffList = await Staff.find({}, 'staffId name'); // Only fetch staffId and name

    const payslipMessages = staffList.map(staff => ({
      message: `Generate the payslip for: ${staff._id} - ${staff.name}`
    }));

    return NextResponse.json({
      success: true,
      data: payslipMessages
    });
  } catch (error) {
    console.error('Error generating payslip preview:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await connectToDatabase();
  try {
    const { staffId, month } = await req.json();
 
    // 1. Get salary for that staff and month
    const salary = await Salary.findOne({ staffId, month });
    if (!salary) {
      return NextResponse.json({ success: false, message: 'Salary not found' });
    }
 
    // 2. Get staff info to fetch leaveCount
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return Response.json({ success: false, message: 'Staff not found' }, { status: 404 });
    }
 
    const leaveCount = staff.leaveCount || 0;
    let penalty = 0;
 
    // 3. Apply penalty if leaveCount > 10
    if (leaveCount > 10) {
      const extraLeaves = leaveCount - 10;
      penalty = extraLeaves * 1000;
    }
 
    const totalDeductions = (salary.deductions || 0) + penalty;
    const finalNetSalary = salary.netSalary - penalty;
 
    // 4. Create payslip with penalty deducted
    const payslip = await Payslip.create({
      staffId,
      month,
      year: new Date().getFullYear(), // You can adjust this logic
      earnings: {
        basic: salary.basic,
        hra: salary.hra,
        da: salary.da,
        specialAllowance: salary.specialAllowance,
        bonus: salary.bonus,
        other: salary.other || 0
      },
      deductions: {
        pf: salary.pf || 0,
        tds: salary.tds || 0,
        loan: salary.loan || 0,
        leave: penalty,
        other: salary.otherDeductions || 0
      },
      grossEarnings: salary.grossEarnings,
      totalDeductions,
      netSalary: finalNetSalary,
      paymentStatus: 'Pending'
    });
 
    //await payslip.save();
 
    return NextResponse.json({ success: true, message: 'Payslip generated successfully', payslip });
  } catch (err) {
    console.error('Payslip generation error:', err);
    return NextResponse.json({ success: false, error: err.message },{ status: 500 });
  }
}
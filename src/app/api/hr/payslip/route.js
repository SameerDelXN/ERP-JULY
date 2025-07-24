import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongoose';
import { Salary, Payslip } from '@/models/payroll';
import Staff from '@/models/staff';
 
export async function GET(req, context) {
  const identifier = context.params.staffId; // could be ObjectId or staffId string
  await connectDB();
 
  try {
    console.log('📥 Incoming identifier:', identifier);
 
    // ✅ 1. Determine if it's an ObjectId or staffId
    let staff;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      staff = await Staff.findById(identifier);
    }
    if (!staff) {
      staff = await Staff.findOne({ staffId: identifier });
    }
 
    if (!staff) {
      return NextResponse.json({ success: false, message: 'Staff not found' }, { status: 404 });
    }
 
    console.log('✅ Staff found:', staff.name);
 
    // ✅ 2. Check for existing payslips using staff._id
    const payslips = await Payslip.find({ staffId: staff._id });
 
    if (payslips.length > 0) {
      return NextResponse.json({ success: true, data: payslips });
    }
 
    // ✅ 3. Get salary
    const salary = await Salary.findOne({ staffId: staff._id });
    if (!salary) {
      return NextResponse.json({ success: false, message: 'Salary not found' }, { status: 404 });
    }
 
    // ✅ 4. Generate payslip
    const gross = (salary.baseSalary || 0) + (salary.allowances || 0);
    const totalDeductions = (salary.deductions || 0) + (salary.leaveDeduction || 0);
    const net = gross - totalDeductions;
 
    const newPayslip = await Payslip.create({
      staffId: staff._id,
      month: new Date().toLocaleString('default', { month: 'long' }),
      year: new Date().getFullYear(),
      dateOfIssue: new Date(),
      earnings: {
        basic: salary.baseSalary,
        hra: salary.allowances || 0,
        da: 0,
        specialAllowance: 0,
        bonus: 0,
        other: 0
      },
      deductions: {
        pf: salary.deductions || 0,
        tds: 0,
        loan: 0,
        leave: salary.leaveDeduction || 0,
        other: 0
      },
      grossEarnings: gross,
      totalDeductions: totalDeductions,
      netSalary: net,
      paymentStatus: 'Pending'
    });
 
    return NextResponse.json({ success: true, data: [newPayslip] });
  } catch (error) {
    console.error('Payslip generation error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await connectDB();
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
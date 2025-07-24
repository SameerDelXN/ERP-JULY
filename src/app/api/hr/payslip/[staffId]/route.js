/*
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongoose';
import { Salary, Payslip } from '@/models/payroll';
import Staff from '@/models/staff';

export async function GET(req, context) {
  const staffId = context.params.staffId;
  


  await connectDB();

  try {
    //const { params } = context; // ✅ await context in App Router
    //const staffId = params.staffId;

    console.log('📥 Incoming staffId:', staffId);

    // ✅ Check for valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(staffId)) {
      console.log('❌ Invalid staffId format');
      return NextResponse.json({ success: false, message: 'Invalid staffId (ObjectId expected)' }, { status: 400 });
    }

    // ✅ Get staff by ObjectId
    const staff = await Staff.findById(staffId);
    if (!staff) {
      console.log('❌ Staff not found for ID:', staffId);
      return NextResponse.json({ success: false, message: 'Staff not found' }, { status: 404 });
    }

    console.log('✅ Staff found:', staff.name);

    // ✅ Check for existing payslip using ObjectId
    let payslips = await Payslip.find({ staffId: staff._id });
    if (payslips.length > 0) {
      console.log('📤 Returning existing payslips');
      return NextResponse.json({ success: true, data: payslips });
    }

    // ✅ Find salary using staffId (ObjectId)
    const salary = await Salary.findOne({ staffId: staff._id });
    if (!salary) {
      console.log('❌ Salary not found for staff:', staff._id);
      return NextResponse.json({ success: false, message: 'Salary not found' }, { status: 404 });
    }

    console.log('💰 Salary found:', {
      base: salary.baseSalary,
      allowances: salary.allowances,
      deductions: salary.deductions,
      leaveDeduction: salary.leaveDeduction
    });

    // ✅ Auto-generate payslip
    //const netSalary = salary.baseSalary + salary.allowances - salary.deductions - salary.leaveDeduction;
    const gross = (salary.baseSalary || 0) + (salary.allowances || 0);
    const totalDeductions = (salary.deductions || 0) + (salary.leaveDeduction || 0);
    const net = gross - totalDeductions;
  
    //below code is commented
    /* const newPayslip = await Payslip.create({
      staffId: staff._id, // Use ObjectId
      name: staff.name,
      department: staff.department,
      designation: staff.designation,
      basicSalary: salary.baseSalary,
      allowances: salary.allowances,
      deductions: salary.deductions,
      leaveDeduction: salary.leaveDeduction,
      netSalary,
      month: new Date().toLocaleString('default', { month: 'long' }),
      year: new Date().getFullYear()
    });
   // above code is commented

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

    grossEarnings: (salary.baseSalary || 0) + (salary.allowances || 0),
    totalDeductions: (salary.deductions || 0) + (salary.leaveDeduction || 0),
    netSalary: (salary.baseSalary || 0) + (salary.allowances || 0) - (salary.deductions || 0) - (salary.leaveDeduction || 0),

    paymentStatus: 'Pending'
    });

    console.log('✅ Payslip created:', newPayslip);


    return NextResponse.json({ success: true, data: [newPayslip] });
  } catch (error) {
    console.error('Payslip generation error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

*/

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongoose';
import { Salary, Payslip } from '@/models/payroll';
import Staff from '@/models/staff';

export async function POST(req) {
  await connectDB();
  try {
    const { staffId, month, pf = 0, tds = 0, loan = 0, otherDeductions = 0 } = await req.json();

    // Get base salary info
    const salary = await Salary.findOne({ staffId });
    if (!salary) {
      return NextResponse.json({ success: false, message: 'Base salary not found for staffId' });
    }

    // Get staff info
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return NextResponse.json({ success: false, message: 'Staff not found' }, { status: 404 });
    }

    const leaveCount = staff.leaveCount || 0;
    let leavePenalty = 0;

    if (leaveCount > 10) {
      leavePenalty = (leaveCount - 10) * 1000;
    }
    

    const earnings = {
    basic: salary.baseSalary || 0,
    hra: 0,                 // Not stored in Salary
    da: 0,
    specialAllowance: salary.allowances || 0,
    bonus: 0,
    other: 0
    };
    //const grossEarnings = salary.basic + salary.hra + salary.da + salary.specialAllowance + salary.bonus + (salary.other || 0);
    const grossEarnings = 
    (earnings.basic || 0) +
    (earnings.hra || 0) +
    (earnings.da || 0) +
    (earnings.specialAllowance || 0) +
    (earnings.bonus || 0) +
    (earnings.other || 0);


    const totalDeductions = pf + tds + loan + leavePenalty + otherDeductions;
    const netSalary = grossEarnings - totalDeductions;

    const payslip = await Payslip.create({
      staffId,
      month,
      year: new Date().getFullYear(),
      earnings: {
        basic: salary.basic,
        hra: salary.hra,
        da: salary.da,
        specialAllowance: salary.specialAllowance,
        bonus: salary.bonus,
        other: salary.other || 0
      },
      deductions: {
        pf,
        tds,
        loan,
        leave: leavePenalty,
        other: otherDeductions
      },
      grossEarnings,
      totalDeductions,
      netSalary,
      paymentStatus: 'Pending'
    });

    return NextResponse.json({
      success: true,
      message: 'Payslip generated successfully',
      payslip
    });
  } catch (err) {
    console.error('Payslip generation error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}


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

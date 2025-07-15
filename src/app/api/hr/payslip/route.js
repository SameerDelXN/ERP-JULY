import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { Salary, Payslip } from '@/models/payroll';
import Staff from '@/models/staff';


export async function POST(req) {
  try {
    const { staffId, month } = await req.json();

    // 1. Get salary for that staff and month
    const salary = await Salary.findOne({ staffId, month });
    if (!salary) {
      return Response.json({ success: false, message: 'Salary not found' });
    }

    // 2. Get staff info to fetch leaveCount
    const staff = await Staff.findOne({ staffId });
    if (!staff) {
      return Response.json({ success: false, message: 'Staff not found' });
    }

    const leaveCount = staff.leaveCount || 0;
    let penalty = 0;

    // 3. Apply penalty if leaveCount > 10
    if (leaveCount > 10) {
      const extraLeaves = leaveCount - 10;
      penalty = extraLeaves * 1000;
    }

    const finalNetSalary = salary.netSalary - penalty;

    // 4. Create payslip with penalty deducted
    const payslip = new Payslip({
      staffId,
      month,
      basic: salary.basic,
      hra: salary.hra,
      allowance: salary.allowance,
      deductions: salary.deductions + penalty,
      bonus: salary.bonus,
      netSalary: finalNetSalary,
      leaveCount: leaveCount,
      leavePenalty: penalty
    });

    await payslip.save();

    return Response.json({ success: true, message: 'Payslip generated successfully', payslip });
  } catch (err) {
    console.error('Payslip generation error:', err);
    return Response.json({ success: false, error: err.message });
  }
}



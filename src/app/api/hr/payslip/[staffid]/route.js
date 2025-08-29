import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
//import connectDB from '@/lib/mongoose';
import { connectToDatabase } from '@/lib/mongoose';
import { Salary, Payslip } from '@/models/payroll';
import Staff from '@/models/staff';

// export async function GET(req, context) {
//   // const identifier = context.params.id; // updated to match [id] folder name
//   // await connectDB();
//   const identifier = context.params.staffid;


//   try {
//     console.log('📥 Incoming identifier:', identifier);

//     // 🔍 Try resolving by ObjectId or staffId
//     let staff;
//     if (mongoose.Types.ObjectId.isValid(identifier)) {
//       staff = await Staff.findById(identifier);
//     }
//     if (!staff) {
//       staff = await Staff.findOne({ staffId: identifier });
//     }

//     if (!staff) {
//       return NextResponse.json(
//         { success: false, message: 'Staff not found' },
//         { status: 404 }
//       );
//     }

//     console.log('✅ Staff found:', staff.name);

//     // 📄 Check for existing payslips (for current month & year if needed)
//     const payslips = await Payslip.find({ staffId: staff._id });

//     if (payslips.length > 0) {
//       return NextResponse.json({ success: true, data: payslips });
//     }

//     // 💰 Fetch salary
//     const salary = await Salary.findOne({ staffId: staff._id });
//     if (!salary) {
//       return NextResponse.json(
//         { success: false, message: 'Salary not found' },
//         { status: 404 }
//       );
//     }

//     // 💸 Generate new payslip
//     const gross = (salary.baseSalary || 0) + (salary.allowances || 0);
//     const totalDeductions = (salary.deductions || 0) + (salary.leaveDeduction || 0);
//     const net = gross - totalDeductions;

//     const newPayslip = await Payslip.create({
//       staffId: staff._id,
//       month: new Date().toLocaleString('default', { month: 'long' }),
//       year: new Date().getFullYear(),
//       dateOfIssue: new Date(),
//       earnings: {
//         basic: salary.baseSalary,
//         hra: salary.allowances || 0,
//         da: 0,
//         specialAllowance: 0,
//         bonus: 0,
//         other: 0
//       },
//       deductions: {
//         pf: salary.deductions || 0,
//         tds: 0,
//         loan: 0,
//         leave: salary.leaveDeduction || 0,
//         other: 0
//       },
//       grossEarnings: gross,
//       totalDeductions: totalDeductions,
//       netSalary: net,
//       paymentStatus: 'Pending'
//     });

//     return NextResponse.json({ success: true, data: [newPayslip] });
//   } catch (error) {
//     console.error('❌ Payslip generation error:', error);
//     return NextResponse.json(
//       { success: false, message: 'Server error', error: error.message },
//       { status: 500 }
//     );
//   }
// }



// export async function GET(req, { params }) {
//   await connectDB(); // First await any async operations
//   const identifier = params.staffid; // Then access params

//   try {
//     console.log('📥 Incoming identifier:', identifier);

//     // 🔍 Find staff
//     let staff;
//     if (mongoose.Types.ObjectId.isValid(identifier)) {
//       staff = await Staff.findById(identifier);
//     }
//     if (!staff) {
//       staff = await Staff.findOne({ staffId: identifier });
//     }

//     if (!staff) {
//       return NextResponse.json(
//         { success: false, message: 'Staff not found' },
//         { status: 404 }
//       );
//     }

//     console.log('✅ Staff found:', staff.name);

//     const payslips = await Payslip.find({ staffId: staff._id });

//     if (payslips.length > 0) {
//       return NextResponse.json({ success: true, data: payslips });
//     }

//     const salary = await Salary.findOne({ staffId: staff._id });
//     if (!salary) {
//       return NextResponse.json(
//         { success: false, message: 'Salary not found' },
//         { status: 404 }
//       );
//     }

//     const gross = (salary.earnings.baseSalary || 0) + (salary.allowances || 0);
//     const totalDeductions = (salary.deductions || 0) + (salary.leaveDeduction || 0);
//     const net = gross - totalDeductions;

//     const newPayslip = await Payslip.create({
//       staffId: staff._id,
//       month: new Date().toLocaleString('default', { month: 'long' }),
//       year: new Date().getFullYear(),
//       dateOfIssue: new Date(),
//       earnings: {
//         basic: salary.earnings.baseSalary,
//         hra: salary.earnings.allowances || 0,
//         da: 0,
//         specialAllowance: 0,
//         bonus: 0,
//         other: 0
//       },
//       deductions: {
//         pf: salary.deductions.pf || 0,
//         tds: 0,
//         loan: 0,
//         leave: salary.deduction.leave || 0,
//         other: 0
//       },
//       grossEarnings: gross,
//       totalDeductions: totalDeductions,
//       netSalary: net,
//       paymentStatus: 'Pending'
//     });

//     return NextResponse.json({ success: true, data: [newPayslip] });
//   } catch (error) {
//     console.error('❌ Payslip generation error:', error);
//     return NextResponse.json(
//       { success: false, message: 'Server error', error: error.message },
//       { status: 500 }
//     );
//   }
// }

export async function GET(req, { params }) {
  await connectToDatabase();
  const identifier = params.staffId;
  console.log('📥 Incoming identifier:', identifier);

  try {
    

    // Find staff
    let staff = await Staff.findOne({ staffId: identifier });
    if (!staff && mongoose.Types.ObjectId.isValid(identifier)) {
      staff = await Staff.findById(identifier);
    }
    if (!staff) {
      return NextResponse.json(
        { success: false, message: 'Staff not found' },
        { status: 404 }
      );
    }

    console.log('✅ Staff found:', staff.name);

    // Check for existing payslip for current month/year
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();
    const existingPayslip = await Payslip.findOne({
      staffId: staff._id,
      month: currentMonth,
      year: currentYear,
    });

    if (existingPayslip) {
      return NextResponse.json({ success: true, data: [existingPayslip] });
    }

    // Find salary
    const salary = await Salary.findOne({ staffId: staff._id });
    if (!salary) {
      return NextResponse.json(
        { success: false, message: 'Salary not found' },
        { status: 404 }
      );
    }

    // Calculate earnings and deductions
    const gross =
      (salary.earnings?.baseSalary || 0) +
      (salary.earnings?.hra || 0) +
      (salary.earnings?.da || 0);
    const totalDeductions = (salary.deductions?.pf || 0) + (salary.deductions?.leave || 0);
    const net = gross - totalDeductions;

    // Create new payslip
    const newPayslip = await Payslip.create({
      staffId: staff._id,
      month: currentMonth,
      year: currentYear,
      dateOfIssue: new Date(),
      earnings: {
        basic: salary.earnings?.baseSalary || 0,
        hra: salary.earnings?.hra || 0,
        da: salary.earnings?.da || 0,
        specialAllowance: salary.earnings?.specialAllowance || 0,
        bonus: salary.earnings?.bonus || 0,
        other: salary.earnings?.other || 0,
      },
      deductions: {
        pf: salary.deductions?.pf || 0,
        tds: salary.deductions?.tds || 0,
        loan: salary.deductions?.loan || 0,
        leave: salary.deductions?.leave || 0,
        other: salary.deductions?.other || 0,
      },
      grossEarnings: gross,
      totalDeductions: totalDeductions,
      netSalary: net,
      paymentStatus: 'Pending',
    });

    return NextResponse.json({ success: true, data: [newPayslip] });
  } catch (error) {
    console.error('❌ Payslip generation error:', { identifier, error: error.message });
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  await connectToDatabase();
  const identifier = params.staffId;

  try {
    const { month, year } = await req.json();
    const validMonths = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    if (!month || !year || !validMonths.includes(month) || !/^\d{4}$/.test(year)) {
      return NextResponse.json(
        { success: false, message: 'Valid month and year are required' },
        { status: 400 }
      );
    }

    // Find staff
    let staff = await Staff.findOne({ staffId: identifier });
    if (!staff && mongoose.Types.ObjectId.isValid(identifier)) {
      staff = await Staff.findById(identifier);
    }
    if (!staff) {
      return NextResponse.json(
        { success: false, message: 'Staff not found' },
        { status: 404 }
      );
    }

    // Check for existing payslip
    let payslip = await Payslip.findOne({ staffId: staff._id, month, year });
    if (payslip) {
      return NextResponse.json({ success: true, data: [payslip] });
    }

    // Find salary
    const salary = await Salary.findOne({ staffId: staff._id });
    if (!salary) {
      return NextResponse.json(
        { success: false, message: 'Salary not found' },
        { status: 404 }
      );
    }

    // Calculate earnings and deductions
    const gross =
      (salary.earnings?.baseSalary || 0) +
      (salary.earnings?.hra || 0) +
      (salary.earnings?.da || 0);
    const totalDeductions = (salary.deductions?.pf || 0) + (salary.deductions?.leave || 0);
    const net = gross - totalDeductions;

    // Create new payslip
    payslip = await Payslip.create({
      staffId: staff._id,
      month,
      year,
      dateOfIssue: new Date(),
      earnings: {
        basic: salary.earnings?.baseSalary || 0,
        hra: salary.earnings?.hra || 0,
        da: salary.earnings?.da || 0,
        specialAllowance: salary.earnings?.specialAllowance || 0,
        bonus: salary.earnings?.bonus || 0,
        other: salary.earnings?.other || 0,
      },
      deductions: {
        pf: salary.deductions?.pf || 0,
        tds: salary.deductions?.tds || 0,
        loan: salary.deductions?.loan || 0,
        leave: salary.deductions?.leave || 0,
        other: salary.deductions?.other || 0,
      },
      grossEarnings: gross,
      totalDeductions: totalDeductions,
      netSalary: net,
      paymentStatus: 'Pending',
    });

    return NextResponse.json({ success: true, data: [payslip] });
  } catch (error) {
    console.error('❌ Payslip POST error:', { identifier, month, year, error: error.message });
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
  
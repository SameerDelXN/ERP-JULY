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
  await connectToDatabase(); // First await any async operations
  const identifier = params.staffid; // Then access params

  try {
    console.log('📥 Incoming identifier:', identifier);

    // 🔍 Find staff
    let staff;
    
    // First try to find by staffId (string)
    staff = await Staff.findOne({ staffId: identifier });
    
    // If not found by staffId, try by ObjectId
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

    // Use staff._id (ObjectID) for all subsequent queries
    const payslips = await Payslip.find({ staffId: staff._id });

    if (payslips.length > 0) {
      return NextResponse.json({ success: true, data: payslips });
    }

    const salary = await Salary.findOne({ staffId: staff._id });
    if (!salary) {
      return NextResponse.json(
        { success: false, message: 'Salary not found' },
        { status: 404 }
      );
    }

    const gross = (salary.earnings.baseSalary || 0) + (salary.allowances || 0);
    const totalDeductions = (salary.deductions || 0) + (salary.leaveDeduction || 0);
    const net = gross - totalDeductions;

    const newPayslip = await Payslip.create({
      staffId: staff._id, // Using the ObjectID here
      month: new Date().toLocaleString('default', { month: 'long' }),
      year: new Date().getFullYear(),
      dateOfIssue: new Date(),
      earnings: {
        basic: salary.earnings.baseSalary,
        hra: salary.earnings.allowances || 0,
        da: 0,
        specialAllowance: 0,
        bonus: 0,
        other: 0
      },
      deductions: {
        pf: salary.deductions.pf || 0,
        tds: 0,
        loan: 0,
        leave: salary.deductions.leave || 0, // Fixed typo from 'deduction' to 'deductions'
        other: 0
      },
      grossEarnings: gross,
      totalDeductions: totalDeductions,
      netSalary: net,
      paymentStatus: 'Pending'
    });

    return NextResponse.json({ success: true, data: [newPayslip] });
  } catch (error) {
    console.error('❌ Payslip generation error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  await connectToDatabase();
  const identifier = params.staffid;
  try {
    const { month, year } = await req.json();
    if (!month || !year) {
      return NextResponse.json({ success: false, message: 'Month and year are required.' }, { status: 400 });
    }

    // Find staff by staffId (string) or ObjectId
    let staff = await Staff.findOne({ staffId: identifier });
    if (!staff && mongoose.Types.ObjectId.isValid(identifier)) {
      staff = await Staff.findById(identifier);
    }
    if (!staff) {
      return NextResponse.json({ success: false, message: 'Staff not found' }, { status: 404 });
    }

    // Try to find existing payslip for this staff, month, and year
    let payslip = await Payslip.findOne({ staffId: staff._id, month, year });
    if (payslip) {
      return NextResponse.json({ success: true, data: [payslip] });
    }

    // Find salary info
    const salary = await Salary.findOne({ staffId: staff._id });
    if (!salary) {
      return NextResponse.json({ success: false, message: 'Salary not found' }, { status: 404 });
    }

    // Calculate earnings and deductions (customize as needed)
    const gross = (salary.earnings?.baseSalary || 0) + (salary.earnings?.allowances || 0);
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
        hra: salary.earnings?.allowances || 0,
        da: 0,
        specialAllowance: 0,
        bonus: 0,
        other: 0
      },
      deductions: {
        pf: salary.deductions?.pf || 0,
        tds: 0,
        loan: 0,
        leave: salary.deductions?.leave || 0,
        other: 0
      },
      grossEarnings: gross,
      totalDeductions: totalDeductions,
      netSalary: net,
      paymentStatus: 'Pending'
    });

    return NextResponse.json({ success: true, data: [payslip] });
  } catch (error) {
    console.error('❌ Payslip POST error:', error);
    return NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
  }
}
  
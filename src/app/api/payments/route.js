import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import { FeeReceipt } from '@/models/feeReceipt';
import Admission from '@/app/models/admissionSchema';

export async function GET() {
  try {
    await connectToDatabase();

    // Query real fee receipts
    const receipts = await FeeReceipt.find({})
      .populate('student')
      .populate('admission')
      .sort({ date: -1 })
      .lean();

    // Transform receipt records to payment report records
    const paymentRecords = receipts.map(receipt => {
      // Find the associated student/admission profile
      const recordUser = receipt.admission || receipt.student;
      const studentName = recordUser?.fullName || 'Unknown Student';
      const studentId = recordUser?.studentId || 'N/A';
      const department = recordUser?.branch || 'Not Assigned';
      const email = recordUser?.email || '';

      // Date parsing
      const dateObj = receipt.date ? new Date(receipt.date) : new Date();

      // Format Date: DD/MM/YYYY
      const paymentDate = dateObj.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      // Format Time: HH:MM:SS AM/PM
      const paymentTime = dateObj.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });

      return {
        _id: receipt._id,
        studentName,
        studentId,
        feeType: receipt.remarks || 'Fee Payment',
        amount: receipt.amountPaid || 0,
        paymentDate,
        paymentTime,
        status: 'Paid',
        transactionId: receipt.receiptNumber,
        receiptNumber: receipt.receiptNumber,
        generatedBy: receipt.createdBy || 'System',
        email,
        department,
        paymentMode: receipt.paymentMode || 'Cash'
      };
    });

    return NextResponse.json({
      success: true,
      data: paymentRecords
    });

  } catch (error) {
    console.error('[GET_PAYMENTS_ERROR]', error);
    return NextResponse.json({
      success: false,
      message: 'Internal Server Error: ' + error.message
    }, { status: 500 });
  }
}

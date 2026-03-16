import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { FeeReceipt } from "@/models/feeReceipt";
import Student from "@/app/models/studentSchema";
import FeeStructure from "@/app/models/feeStructureSchema";
import { generateFeeReceiptPDF } from "@/utils/generateFeeReceiptPdf";

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const receiptId = searchParams.get("receiptId");

    if (!receiptId) {
      return new Response(JSON.stringify({ error: "Receipt ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get receipt with student data
    const receipt = await FeeReceipt.findById(receiptId).populate('student');
    if (!receipt) {
      return new Response(JSON.stringify({ error: 'Receipt not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Generating PDF for receipt:', receipt);

    // Find the fee structure for this student
    let feeStructure = null;
    if (receipt.student) {
      feeStructure = await FeeStructure.findOne({
        programType: receipt.student.programType,
        departmentName: receipt.student.branch,
        year: receipt.student.currentYear,
        caste: 'general', // Default caste
        category: 'management', // Default category
        isActive: true
      });
    }

    console.log('Found fee structure:', feeStructure);

    // Create complete receipt data with fee structure
    const completeReceiptData = {
      ...receipt.toObject(),
      feeStructure: feeStructure
    };

    console.log('Complete receipt data for PDF:', completeReceiptData);

    // Get PDF buffer from utility (now async)
    const pdfBuffer = await generateFeeReceiptPDF(completeReceiptData);

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Receipt-${receipt.receiptNumber}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });

  } catch (error) {
    console.error('Error in PDF route:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate PDF: ' + error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const { receipt } = body;

    if (!receipt) {
      return new Response(JSON.stringify({ error: "Receipt data is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log('Generating PDF for receipt data:', receipt);

    // Get PDF buffer from utility
    const pdfBuffer = await generateFeeReceiptPDF(receipt);

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="receipt-${receipt.receiptNumber || 'unknown'}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });

  } catch (error) {
    console.error('Error in PDF POST route:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate PDF: ' + error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

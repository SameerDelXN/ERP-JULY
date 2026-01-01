import { generateFeeReceiptPDF } from '@/utils/generateFeeReceiptPdf';
import { FeeReceipt } from '@/models/feeReceipt';
import { Student } from '@/models/student';
import { connectToDatabase } from '@/lib/mongoose';

export async function GET(req) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const receiptId = searchParams.get('receiptId');

  if (!receiptId) {
    return new Response(JSON.stringify({ error: 'Missing receiptId' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const receipt = await FeeReceipt.findById(receiptId).populate('student');
  if (!receipt) {
    return new Response(JSON.stringify({ error: 'Receipt not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const stream = generateFeeReceiptPDF(receipt);

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="Receipt-${receipt.receiptNumber}.pdf"`,
    },
  });
}

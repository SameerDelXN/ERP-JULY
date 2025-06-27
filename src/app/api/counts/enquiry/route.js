import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import enquirySchema from '../../../models/enquirySchema';

export async function GET() {
  try {
    await connectToDatabase();

    const totalEnquiries = await enquirySchema.countDocuments();
    const newEnquiries = await enquirySchema.countDocuments({ status: 'New' });
    const convertedEnquiries = await enquirySchema.countDocuments({ status: 'Converted' });

    const conversionRate = totalEnquiries > 0
      ? Math.round((convertedEnquiries / totalEnquiries) * 100)
      : 0;

    return NextResponse.json({
      total: totalEnquiries,
      new: newEnquiries,
      converted: convertedEnquiries,
      conversionRate
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json({
      message: 'Server error'
    }, { status: 500 });
  }
}

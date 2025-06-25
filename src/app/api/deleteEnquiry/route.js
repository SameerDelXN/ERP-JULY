import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/mongodb'; // adjust path if needed
import Enquiry from '../../models/enquiryform'; // model name is 'Enquiry'

export async function DELETE(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Enquiry ID is required' 
      }, { status: 400 });
    }

    const deletedEnquiry = await Enquiry.findByIdAndDelete(id);

    if (!deletedEnquiry) {
      return NextResponse.json({ 
        success: false, 
        message: 'Enquiry not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Enquiry deleted successfully' 
    }, { status: 200 });

  } catch (error) {
    console.error('Error deleting enquiry:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    }, { status: 500 });
  }
}

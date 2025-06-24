import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/mongodb';
import enquirySchema from '../../models/enquiryform';

export async function POST(req) {
  //await connectToDatabase();

  try {
    const body = await req.json();
    const enquiry = new enquirySchema(body);
    await enquiry.save();


    await connectToDatabase();

    return NextResponse.json({ 
      success: true, 
      message: 'Enquiry submitted successfully' 
    }, { status: 201 });
  } catch (error) {
    console.error('Error saving enquiry:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 400 });
  }
}


/*code to upload files--not working currently  */

// import { NextResponse } from 'next/server';
// import { connectToDatabase } from '../../lib/mongodb';
// import enquirySchema from '../../models/enquiryform';
// import { uploadToGoogleDrive } from '../../lib/googleDriveUpload';

// export async function POST(req) {
//   try {
//     const formData = await req.formData();

//     // Extract document files
//     const birthCertificate = formData.get('birthCertificate');
//     const parentIdProof = formData.get('parentIdProof');

//     // Upload files to Google Drive
//     const birthCertificateResult = await uploadToGoogleDrive(birthCertificate);
//     const parentIdProofResult = await uploadToGoogleDrive(parentIdProof);

//     // Build MongoDB payload from other fields
//     const body = {};
//     for (const [key, value] of formData.entries()) {
//       if (key !== 'birthCertificate' && key !== 'parentIdProof') {
//         body[key] = value;
//       }
//     }

//     // Add document URLs to payload
//     body.birthCertificateUrl = birthCertificateResult.fileUrl;
//     body.parentIdProofUrl = parentIdProofResult.fileUrl;

//     await connectToDatabase();
//     const enquiry = new enquirySchema(body);
//     await enquiry.save();

//     return NextResponse.json({
//       success: true,
//       message: 'Enquiry submitted successfully'
//     }, { status: 201 });

//   } catch (error) {
//     console.error('Error saving enquiry:', error);
//     return NextResponse.json({
//       success: false,
//       error: error.message
//     }, { status: 400 });
//   }
// }

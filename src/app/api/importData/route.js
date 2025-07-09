import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import * as XLSX from 'xlsx'; // Instead of default import // Instead of default import
import admission from '../../models/admissionSchema';
import { connectToDatabase } from '@/app/lib/mongodb';

// Configure mongoose to use the global promise
mongoose.Promise = global.Promise;

export async function POST(request) {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    console.log("Mongodb connected")
    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert the file to buffer
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (jsonData.length === 0) {
      return NextResponse.json({ error: 'No data found in Excel file' }, { status: 400 });
    }

    // Map Excel columns to schema fields
    const fieldMappings = {
      'DTE Application Number': 'dteApplicationNumber',
      'Admission Year': 'admissionYear',
      'Email': 'email',
      'Candidate Full Name(As Per Last Qualifying Examination)': 'fullName',
      'Name As Per Aadhar': 'nameAsPerAadhar',
      'First Name': 'firstName',
      'Middle Name': 'middleName',
      'Last Name': 'lastName',
      'Gender': 'gender',
      'Program Type': 'programType',
      'Year': 'year',
      'Branch': 'branch',
      'Shift': 'shift',
      'Round': 'round',
      'Quota': 'quota',
      'Seat Type': 'seatType',
      'Admission Category as Per DTE': 'admissionCategoryDTE',
      'Fees Category': 'feesCategory',
      'Admission Type': 'admissionType',
      'Cast as per LC': 'casteAsPerLC',
      'Sub Cast as per LC': 'subCasteAsPerLC',
      'Domicile': 'domicile',
      'Nationality': 'nationality',
      'Religion as per LC': 'religionAsPerLC',
      'Date of Birth': 'dateOfBirth',
      'Mother\'s Name (Strictly as per LC/TC)': 'motherName',
      'Family Income': 'familyIncome',
      'Student Whatsapp No.': 'studentWhatsappNumber',
      'Father/Guardian WhatsApp Mobile No.': 'fatherGuardianWhatsappNumber',
      'Mother\'s Mobile No.': 'motherMobileNumber',
      'Is Foreign National?': 'isForeignNational'
    };

    // Process each row
    const processedData = jsonData.map(row => {
      const admissionData = {};
      
      // Map Excel columns to schema fields
      Object.keys(fieldMappings).forEach(excelCol => {
        const schemaField = fieldMappings[excelCol];
        if (row[excelCol] !== undefined) {
          // Handle special cases
          if (excelCol === 'Date of Birth') {
  const parsed = XLSX.SSF.parse_date_code(row[excelCol]);
  if (parsed) {
    admissionData[schemaField] = new Date(parsed.y, parsed.m - 1, parsed.d);
  }
}
else if (excelCol === 'Is Foreign National?') {
            // Convert to boolean
            admissionData[schemaField] = String(row[excelCol]).toLowerCase() === 'yes';
          } else {
            admissionData[schemaField] = row[excelCol];
          }
        }
      });

      // Add system fields
      admissionData.status = 'approved';
      admissionData.createdAt = new Date();
      admissionData.updatedAt = new Date();

      return admissionData;
    });
    console.log("processedData",processedData);
    // Insert into database
    const result = await admission.insertMany(processedData, { ordered: false });
    console.log(result)
    return NextResponse.json({
      message: 'Data imported successfully',
      totalRecords: jsonData.length,
      insertedCount: result.length,
      duplicates: jsonData.length - result.length
    });

  } catch (error) {
    console.error('Error importing data:', error);
    if (error.writeErrors) {
      // Handle duplicate errors or other bulk write errors
      const duplicates = error.writeErrors.map(err => err.err.op);
      return NextResponse.json({
        error: 'Partial import completed',
        message: `Imported ${error.result.result.nInserted} records, ${error.writeErrors.length} duplicates skipped`,
        duplicates: duplicates
      }, { status: 207 });
    }
    return NextResponse.json({ 
      error: 'Failed to import data',
      details: error.message 
    }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import * as XLSX from 'xlsx';
import admission from '../../models/admissionSchema';
import { connectToDatabase } from '@/app/lib/mongodb';

// Configure mongoose to use the global promise
mongoose.Promise = global.Promise;

export async function POST(request) {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    console.log("Mongodb connected");

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

    // Required fields that cannot be null/empty
    const requiredFields = [
      'dteApplicationNumber',
      'admissionYear',
      'email',
      'fullName',
      'gender',
      'programType',
      'year',
      'branch',
      'dateOfBirth'
    ];

    // Process each row with validation
    const processedData = [];
    const validationErrors = [];
    
    jsonData.forEach((row, index) => {
      const rowNumber = index + 2; // +2 because header is row 1 and JS is 0-based
      const admissionData = {};
      let hasError = false;
      const rowErrors = [];

      // Check required fields first
      requiredFields.forEach(field => {
        const excelCol = Object.keys(fieldMappings).find(
          key => fieldMappings[key] === field
        );
        
        if (!excelCol || row[excelCol] === undefined || row[excelCol] === null || row[excelCol] === '') {
          hasError = true;
          rowErrors.push(`Missing required field: ${field}`);
        }
      });

      if (hasError) {
        validationErrors.push({
          row: rowNumber,
          errors: rowErrors
        });
        return; // Skip this row
      }

      // Map Excel columns to schema fields
      Object.keys(fieldMappings).forEach(excelCol => {
        const schemaField = fieldMappings[excelCol];
        
        // Skip if field is not in the row
        if (row[excelCol] === undefined || row[excelCol] === null) {
          return;
        }

        try {
          // Handle special cases
          if (excelCol === 'Date of Birth') {
            const parsed = XLSX.SSF.parse_date_code(row[excelCol]);
            if (parsed) {
              admissionData[schemaField] = new Date(parsed.y, parsed.m - 1, parsed.d);
            } else {
              throw new Error('Invalid date format');
            }
          } else if (excelCol === 'Is Foreign National?') {
            // Convert to boolean
            admissionData[schemaField] = String(row[excelCol]).toLowerCase() === 'yes';
          } else if (excelCol === 'Email') {
            // Basic email validation
            const email = String(row[excelCol]).trim();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
              throw new Error('Invalid email format');
            }
            admissionData[schemaField] = email;
          } else if (excelCol === 'Student Whatsapp No.' || 
                    excelCol === 'Father/Guardian WhatsApp Mobile No.' || 
                    excelCol === 'Mother\'s Mobile No.') {
            // Phone number validation
            const phone = String(row[excelCol]).replace(/\D/g, '');
            if (phone.length < 10) {
              throw new Error('Invalid phone number');
            }
            admissionData[schemaField] = phone;
          } else {
            // Trim string values
            admissionData[schemaField] = typeof row[excelCol] === 'string' 
              ? row[excelCol].trim() 
              : row[excelCol];
          }
        } catch (error) {
          hasError = true;
          rowErrors.push(`Field ${excelCol}: ${error.message}`);
        }
      });

      if (hasError) {
        validationErrors.push({
          row: rowNumber,
          errors: rowErrors
        });
      } else {
        // Add system fields
        admissionData.status = 'approved';
        admissionData.createdAt = new Date();
        admissionData.updatedAt = new Date();
        processedData.push(admissionData);
      }
    });

    // If there are validation errors, return them
    if (validationErrors.length > 0) {
      return NextResponse.json({
        error: 'Validation errors found',
        totalRecords: jsonData.length,
        validRecords: processedData.length,
        invalidRecords: validationErrors.length,
        validationErrors: validationErrors
      }, { status: 400 });
    }

    console.log("processedData", processedData);
    
    // Insert into database
    const result = await admission.insertMany(processedData, { ordered: false });
    console.log(result);
    
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
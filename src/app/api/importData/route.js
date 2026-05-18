import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Admission from "@/app/models/admissionSchema";
import Student from "@/app/models/studentSchema";
import Academic from "@/app/models/academicSchema";
import ImportedFile from "@/app/models/importedFileSchema";
import User from "@/app/models/userSchema";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import * as XLSX from "xlsx";

export async function POST(request) {
  let validationErrors = [];
  let importedFileRecord = null;
  let jsonData = [];
  try {
    // Connect to MongoDB
    await connectToDatabase();
    console.log("Mongodb connected");

    // Get the form data
    const formData = await request.formData();
    const file = formData.get("file");
    const counsellorId = formData.get("counsellorId");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!counsellorId) {
      return NextResponse.json({ error: "Counsellor ID is required" }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "imported-excel");
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory already exists, continue
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}_${originalName}`;
    const filePath = path.join(uploadsDir, fileName);

    // Save file to filesystem
    const buffer = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(buffer));

    // Create imported file record in database
    importedFileRecord = new ImportedFile({
      fileName: fileName,
      originalFileName: originalName,
      filePath: `/uploads/imported-excel/${fileName}`,
      fileSize: file.size,
      mimeType: file.type,
      importedBy: counsellorId,
      status: "processing"
    });

    await importedFileRecord.save();
    console.log("Imported file record saved:", importedFileRecord);

    // Convert the file to buffer for processing
    let workbook;
    try {
      workbook = XLSX.read(buffer);
    } catch (xlsxError) {
      console.error("XLSX read error:", xlsxError);
      await ImportedFile.findByIdAndUpdate(importedFileRecord._id, {
        status: "failed",
        totalRecords: 0,
        importedRecords: 0,
        duplicateRecords: 0,
        errorRecords: 1,
        importErrors: [{
          row: "File",
          error: `Invalid Excel file format: ${xlsxError.message}`,
          data: null
        }]
      });
      return NextResponse.json({
        error: "Invalid Excel file format",
        details: xlsxError.message
      }, { status: 400 });
    }

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    jsonData = XLSX.utils.sheet_to_json(worksheet);
    console.log("Parsed Excel data:", jsonData.length, "rows");

    if (jsonData.length === 0) {
      return NextResponse.json(
        { error: "No data found in Excel file" },
        { status: 400 }
      );
    }

    // Define required columns
    const requiredColumns = [
      "DTEApplicationNumber",
      "FirstName",
      "Email",
      "StudentWhatsappNo",
    ];

    // Get header row (first row)
    const headers = Object.keys(jsonData[0]);

    // Check if all required columns exist
    const missingColumns = requiredColumns.filter(
      (col) => !headers.includes(col)
    );

    if (missingColumns.length > 0) {
      // Update imported file record with validation errors
      await ImportedFile.findByIdAndUpdate(importedFileRecord._id, {
        status: "failed",
        totalRecords: jsonData.length,
        importedRecords: 0,
        duplicateRecords: 0,
        errorRecords: jsonData.length,
        importErrors: [{
          row: "Header",
          error: `Missing required columns: ${missingColumns.join(", ")}`,
          data: { missingColumns, availableHeaders: headers }
        }]
      });

      return NextResponse.json(
        {
          error: "Validation errors found",
          details: `Missing required columns: ${missingColumns.join(", ")}`,
          invalidRecords: jsonData.length,
        },
        { status: 400 }
      );
    }

    // Map Excel columns to schema fields
    const mappedData = jsonData.map((row, index) => {
      try {
        const firstName = row.FirstName?.toString().trim() || "";
        const lastName = row.LastName?.toString().trim() || "";
        const fullName = `${firstName} ${lastName}`.trim();
        const email = row.Email?.toString().trim().toLowerCase();

        if (!email) throw new Error("Email is required");
        if (!fullName) throw new Error("Full Name (First Name) is required");

        return {
          dteApplicationNumber: row.DTEApplicationNumber?.toString().trim(),
          firstName: row.FirstName?.toString().trim(),
          lastName: lastName,
          fullName: fullName,
          email: email,
          studentWhatsappNumber: row.StudentWhatsappNo?.toString().trim(),
          branch: row.Branch?.toString().trim() || "Computer Engineering",
          programType: row.ProgramType?.toString().trim() || "Engineering",
          year: row.Year?.toString().trim() || "First Year",
          round: row.Round?.toString().trim() || "Round 1",
          seatType: row.SeatType?.toString().trim() || "General",
          admissionCategoryDTE: row.AdmissionCategoryDTE?.toString().trim() || "General",
          gender: row.Gender?.toString().trim() || "Not Specified",
          motherName: row.MotherName?.toString().trim() || "",
          fatherGuardianWhatsappNumber: row.FatherGuardianWhatsappNo?.toString().trim() || "",
          casteAsPerLC: row.CasteAsPerLC?.toString().trim() || "",
          domicile: row.Domicile?.toString().trim() || "Maharashtra",
          nationality: row.Nationality?.toString().trim() || "Indian",
          familyIncome: row.FamilyIncome?.toString().trim() || "",
          admissionYear: row.AdmissionYear?.toString().trim() || new Date().getFullYear().toString(),
          quota: row.Quota?.toString().trim() || "",
          motherMobileNumber: row.MotherMobileNumber?.toString().trim() || "",
          religionAsPerLC: row.ReligionAsPerLC?.toString().trim() || "",
          isForeignNational: row.IsForeignNational === "Yes" || row.IsForeignNational === true,
          dateOfBirth: row.DateOfBirth || row.DateofBirth ? new Date(row.DateOfBirth || row.DateofBirth) : null,
          status: "approved",
          counsellorId: counsellorId,
        };
      } catch (error) {
        validationErrors.push({
          row: index + 2, // +2 because Excel rows start from 1 and header is row 1
          errors: [`Data mapping error: ${error.message}`],
          data: row,
        });
        return null;
      }
    }).filter(Boolean); // Remove null entries

    // Check for duplicates
    const existingApplications = await Admission.find({
      dteApplicationNumber: { $in: mappedData.map(item => item.dteApplicationNumber) }
    });

    const duplicates = [];
    const dataToInsert = [];

    mappedData.forEach((item) => {
      const isDuplicate = existingApplications.some(
        existing => existing.dteApplicationNumber === item.dteApplicationNumber
      );

      if (isDuplicate) {
        duplicates.push({
          dteApplicationNumber: item.dteApplicationNumber,
          fullName: item.fullName,
          rowNumber: item.rowNumber
        });
      } else {
        dataToInsert.push(item);
      }
    });

    // Insert non-duplicate data
    let result = [];
    if (dataToInsert.length > 0) {
      result = await Admission.insertMany(dataToInsert);
      console.log("Data inserted successfully");
    }

    // Convert inserted admissions to student records
    const conversionResults = [];
    for (const doc of result) {
      try {
        const studentInfo = await convertAdmissionToStudent(doc);
        conversionResults.push({ success: true, docId: doc._id, studentId: studentInfo.studentId });
      } catch (err) {
        console.error(`Failed to convert admission ${doc._id} to student:`, err);
        conversionResults.push({ success: false, docId: doc._id, error: err.message });
      }
    }

    // Update imported file record with success status
    await ImportedFile.findByIdAndUpdate(importedFileRecord._id, {
      status: "completed",
      totalRecords: jsonData.length,
      importedRecords: result.length,
      duplicateRecords: duplicates.length,
      errorRecords: validationErrors.length,
      importErrors: validationErrors
    });

    console.log("Imported file record updated successfully");

    return NextResponse.json({
      message: "Data imported successfully",
      totalRecords: jsonData.length,
      insertedCount: result.length,
      duplicateCount: duplicates.length,
      validationErrorCount: validationErrors.length,
      duplicates: duplicates,
      validationErrors: validationErrors,
      conversions: conversionResults
    });

  } catch (error) {
    console.error("Import error:", error);

    // Update imported file record with error status
    if (importedFileRecord && importedFileRecord._id) {
      try {
        await ImportedFile.findByIdAndUpdate(importedFileRecord._id, {
          status: "failed",
          totalRecords: jsonData?.length || 0,
          importedRecords: 0,
          duplicateRecords: 0,
          errorRecords: jsonData?.length || 0,
          importErrors: [{
            row: "System",
            error: error.message,
            data: null
          }]
        });
      } catch (updateError) {
        console.error("Failed to update imported file record:", updateError);
      }
    }

    return NextResponse.json(
      {
        error: "Failed to import data",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Helper function to map admission gender to valid Student schema enum
function mapGenderToValidEnum(gender) {
  if (!gender) return 'Other';
  
  const genderLower = gender.toLowerCase();
  if (genderLower === 'male' || genderLower === 'm') {
    return 'Male';
  } else if (genderLower === 'female' || genderLower === 'f') {
    return 'Female';
  } else {
    return 'Other';
  }
}

// Helper function to map admission programType to valid Student schema enum
function mapProgramTypeToValidEnum(programType) {
  if (!programType) return 'UG';
  
  const programLower = programType.toLowerCase();
  if (programLower.includes('diploma') || programLower.includes('polytechnic')) {
    return 'Diploma';
  } else if (programLower.includes('post') || programLower.includes('master') || programLower.includes('pg') || programLower.includes('m.')) {
    return 'PG';
  } else {
    return 'UG'; // Default to Undergraduate
  }
}

// Helper function to convert admission to student on Excel import
async function convertAdmissionToStudent(admission) {
  console.log(`🔄 [Excel Import] Starting conversion for admission: ${admission._id}`);
  
  // 1. Generate Unique Student ID
  let studentId;
  let isUnique = false;
  let attempts = 0;
  
  while (!isUnique && attempts < 10) {
    const yearSuffix = new Date().getFullYear().toString().slice(-2);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    studentId = `STU${yearSuffix}${randomSuffix}`;
    
    const existingStudent = await Student.findOne({ studentId: studentId });
    const existingUser = await User.findOne({ username: studentId });
    
    if (!existingStudent && !existingUser) {
      isUnique = true;
    }
    attempts++;
  }
  
  if (!isUnique) {
    throw new Error("Unable to generate unique student ID");
  }

  // 2. Generate Unique PRN
  let prn;
  let isPrnUnique = false;
  let prnAttempts = 0;
  
  while (!isPrnUnique && prnAttempts < 50) {
    const yearSuffix = new Date().getFullYear().toString().slice(-2);
    const timestamp = Date.now().toString().slice(-6);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    prn = `PRN${yearSuffix}${timestamp}${randomSuffix}`;
    
    const existingPrn = await Student.findOne({ prn: prn }).lean().exec();
    if (!existingPrn) {
      isPrnUnique = true;
      break;
    }
    prnAttempts++;
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  if (!isPrnUnique) {
    throw new Error("Unable to generate unique PRN");
  }

  // 3. Create Student Profile and User inside a transaction session
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(studentId, salt);

    // Create User record
    const newUser = await User.create([{
      fullName: admission.fullName,
      email: admission.email,
      phone: admission.studentWhatsappNumber?.toString() || "",
      role: "student",
      password: hashedPassword,
      username: studentId,
    }], { session });

    // Create Student record
    const newStudent = await Student.create([{
      studentId: studentId,
      admissionId: admission._id,
      fullName: admission.fullName,
      email: admission.email,
      mobileNumber: admission.studentWhatsappNumber?.toString() || "",
      dateOfBirth: admission.dateOfBirth ? new Date(admission.dateOfBirth) : new Date(),
      gender: mapGenderToValidEnum(admission.gender),
      address: admission.address && admission.address[0] ? admission.address[0] : {},
      programType: mapProgramTypeToValidEnum(admission.programType),
      branch: admission.branch,
      currentYear: admission.year,
      division: admission.division || "",
      prn: prn,
      counsellorId: admission.counsellorId,
      status: "active",
      feesCategory: admission.feesCategory || "management",
      casteAsPerLC: admission.casteAsPerLC || "",
      subCasteAsPerLC: admission.subCasteAsPerLC || "",
      domicile: admission.domicile || "Maharashtra",
      nationality: admission.nationality || "Indian",
      religionAsPerLC: admission.religionAsPerLC || "",
      isForeignNational: admission.isForeignNational || false,
      motherName: admission.motherName || "",
      familyIncome: admission.familyIncome || "",
      fatherGuardianWhatsappNumber: admission.fatherGuardianWhatsappNumber?.toString() || "",
      motherMobileNumber: admission.motherMobileNumber?.toString() || "",
      seatType: admission.seatType || "General",
      admissionCategoryDTE: admission.admissionCategoryDTE || "General",
      quota: admission.quota || "",
      admissionYear: admission.admissionYear || new Date().getFullYear().toString(),
      round: admission.round || "Round 1",
      admissionType: admission.admissionType || "CAP",
      dteApplicationNumber: admission.dteApplicationNumber,
      totalFees: admission.totalFees || 0
    }], { session });

    // 4. Assign student to academic division
    let assignedDivisionName = "";
    const academicDoc = await Academic.findOne({
      department: admission.branch,
      programType: mapProgramTypeToValidEnum(admission.programType)
    }).session(session);

    if (academicDoc) {
      const yearObj = academicDoc.years.find((y) => y.year === admission.year);
      if (yearObj) {
        let assignedDivision = yearObj.divisions.find((div) => div.students.length < 50);

        if (!assignedDivision) {
          const nextDivisionLetter = String.fromCharCode(65 + yearObj.divisions.length);
          assignedDivision = {
            name: nextDivisionLetter,
            students: [],
            subjects: [],
            timetable: [],
            exams: [],
            attendance: [],
          };
          yearObj.divisions.push(assignedDivision);
        }

        assignedDivision.students.push(newStudent[0]._id);
        await academicDoc.save({ session });
        
        assignedDivisionName = assignedDivision.name;
        newStudent[0].division = assignedDivisionName;
        await newStudent[0].save({ session });
      }
    }

    // Update Admission status
    await Admission.findByIdAndUpdate(admission._id, {
      status: "approved",
      prn: prn,
      isPrnGenerated: true
    }, { session });

    await session.commitTransaction();
    session.endSession();
    
    return {
      success: true,
      studentId: studentId,
      prn: prn
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

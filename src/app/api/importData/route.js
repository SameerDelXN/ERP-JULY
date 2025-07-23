import { NextResponse } from "next/server";
import mongoose from "mongoose";
import * as XLSX from "xlsx";
import admission from "../../models/admissionSchema";
import studentSchema from "../../../app/models/studentSchema";
import academicSchema from "../../../app/models/academicSchema";
import { connectToDatabase } from "@/app/lib/mongodb";

// Configure mongoose to use the global promise
mongoose.Promise = global.Promise;

export async function POST(request) {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    console.log("Mongodb connected");

    // Get the form data
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    
    // Convert the file to buffer
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    console.log(jsonData.length)
    if (jsonData.length === 0) {
      return NextResponse.json(
        { error: "No data found in Excel file" },
        { status: 400 }
      );
    }
    // Map Excel columns to schema fields
    const fieldMappings = {
      "DTEApplicationNumber": "dteApplicationNumber",
      "FirstName": "firstName",
      "MiddleName": "middleName",
      "LastName": "lastName",
      "FullName": "fullName",
      "NameAsPerAadhar": "nameAsPerAadhar",
      "Email": "email",
      "Gender": "gender",
      "PRN": "prn",
      "AdmissionYear": "admissionYear",
      "ProgramType": "programType",
      "Year": "year",
      "Branch": "branch",
      "Shift": "shift",
      "Round": "round",
      "Quota": "quota",
      "SeatType": "seatType",
      "AdmissionCategoryasPerDTE": "admissionCategoryDTE",
      "FeesCategory": "feesCategory",
      "AdmissionType": "admissionType",
      "CastAsPerLC": "casteAsPerLC",
      "SubCastAsPerLC": "subCasteAsPerLC",
      "Domicile": "domicile",
      "Nationality": "nationality",
      "ReligionAsPerLC": "religionAsPerLC",
      "DateofBirth": "dateOfBirth",
      "MothersName": "motherName",
      "FamilyIncome": "familyIncome",
      "StudentWhatsappNo": "studentWhatsappNumber",
      "FatherGuardianWhatsAppMobileNo": "fatherGuardianWhatsappNumber",
      "MothersMobileNo": "motherMobileNumber",
      "IsForeignNational": "isForeignNational",
      "AddressLine": "address.addressLine",
      'City': "address.city",
      'State': "address.state",
      'Pincode': "address.pincode",
      'Country': "address.country",
    };

    // Required fields that cannot be null/empty
    const requiredFields = [
      "dteApplicationNumber",
      "admissionYear",
      "email",
      "fullName",
      "gender",
      "programType",
      "year",
      "branch",
      // "dateOfBirth",
      "studentWhatsappNumber",
    ];

    // Process each row with validation
    const processedData = [];
    const validationErrors = [];

    for (const [index, row] of jsonData.entries()) {
      const rowNumber = index + 2; // +2 because header is row 1 and JS is 0-based
      const admissionData = {};
      let hasError = false;
      const rowErrors = [];

      // Check required fields first
      for (const field of requiredFields) {
        const excelCol = Object.keys(fieldMappings).find(
          (key) => fieldMappings[key] === field
        );

        if (
          !excelCol ||
          row[excelCol] === undefined ||
          row[excelCol] === null ||
          row[excelCol] === ""  
        ) {
          hasError = true;
          rowErrors.push(`Missing required field: ${field}`);
        }
      }

      if (hasError) {
        validationErrors.push({
          row: rowNumber,
          errors: rowErrors,
        });
        continue; // Skip this row
      }

      // Map Excel columns to schema fields
      for (const excelCol of Object.keys(fieldMappings)) {
        const schemaField = fieldMappings[excelCol];
        console.log(excelCol)
        // Skip if field is not in the row
        if (row[excelCol] === undefined || row[excelCol] === null) {
          continue;
        }

        try {
          // Handle special cases
          if (excelCol === "DateofBirth") {
            // Handle both Excel date codes and string dates
            if (typeof row[excelCol] === "number") {
              const parsed = XLSX.SSF.parse_date_code(row[excelCol]);
              if (parsed) {
                admissionData[schemaField] = new Date(
                  parsed.y,
                  parsed.m - 1,
                  parsed.d
                );
              } else {
                throw new Error("Invalid date format");
              }
            } else {
              // Try to parse string date
              const date = new Date(row[excelCol]);
              if (isNaN(date.getTime())) {
                throw new Error("Invalid date format");
              }
              admissionData[schemaField] = date;
            }
          } else if (excelCol === "IsForeignNational") {
            // Convert to boolean
            admissionData[schemaField] =
              String(row[excelCol]).toLowerCase() === "yes";
          } else if (excelCol === "Email") {
            // Basic email validation
            const email = String(row[excelCol]).trim();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
              throw new Error("Invalid email format");
            }
            admissionData[schemaField] = email;
          } else if (
            excelCol === "StudentWhatsappNo" ||
            excelCol === "FatherGuardianWhatsAppMobileNo" ||
            excelCol === "MothersMobileNo"
          ) {
            // Phone number validation
            const phone = String(row[excelCol]).replace(/\D/g, "");
            if (phone.length < 10) {
              throw new Error("Invalid phone number");
            }
            admissionData[schemaField] = phone;
          } else {
            // Trim string values
            admissionData[schemaField] =
              typeof row[excelCol] === "string"
                ? row[excelCol].trim()
                : row[excelCol];
          }
        } catch (error) {
          hasError = true;
          rowErrors.push(`Field ${excelCol}: ${error.message}`);
        }
      }

      if (hasError) {
        validationErrors.push({
          row: rowNumber,
          errors: rowErrors,
        });
      } else {
        // Add system fields
        admissionData.status = "approved";
        admissionData.createdAt = new Date();
        admissionData.updatedAt = new Date();
        admissionData.isPrnGenerated = true
        processedData.push(admissionData);
      }
    }
    console.log(validationErrors)

    // If there are validation errors, return them
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: "Validation errors found",
          totalRecords: jsonData.length,
          validRecords: processedData.length,
          invalidRecords: validationErrors.length,
          validationErrors: validationErrors,
        },
        { status: 400 }
      );
    }
    

    // Insert into database
    const result = await admission.insertMany(processedData, {
      ordered: false,
    });

    // Handle approved status for each inserted record
    for (const doc of result) {
      await handleApprovedStatus(doc, doc._id);
    }

    return NextResponse.json({
      message: "Data imported successfully",
      totalRecords: jsonData.length,
      insertedCount: result.length,
      duplicates: jsonData.length - result.length,
    });
  } catch (error) {
    console.error("Error importing data:", error);
    if (error.writeErrors) {
      // Handle duplicate errors or other bulk write errors
      const duplicates = error.writeErrors.map((err) => ({
        dteApplicationNumber: err.err.op.dteApplicationNumber,
        error: err.err.errmsg,
      }));
      return NextResponse.json(
        {
          error: "Partial import completed",
          message: `Imported ${error.result.result.nInserted} records, ${error.writeErrors.length} duplicates skipped`,
          duplicates: duplicates,
        },
        { status: 207 }
      );
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

async function handleApprovedStatus(admissionData, admissionId) {
  try {
    const {
      programType,
      year,
      branch,
      fullName,
      email,
      studentWhatsappNumber,
      dateOfBirth,
      address,
      isForeignNational,
      nationality,
    } = admissionData;

    // Validate required fields for student creation
    if (!programType || !year || !branch) {
      throw new Error(
        "Missing academic details (programType, year, or branch) required for student creation"
      );
    }

    // Check/create student record
    let student = await studentSchema.findOne({ admissionId });

    if (!student) {
      const studentCount = await studentSchema.countDocuments();
      const studentId = `SCH${new Date().getFullYear()}-${String(
        studentCount + 1
      ).padStart(4, "0")}`;

      student = await studentSchema.create({
        studentId,
        admissionId,
        fullName,
        email: email?.toLowerCase(),
        mobileNumber: studentWhatsappNumber,
        dateOfBirth,
        address: address || {},
        nationality,
        isForeignNational: isForeignNational || false,
        status: "active",
        academicDetails: {
          programType,
          currentYear: year,
          branch,
        },
      });
    }

    // Update academic record
    const academic = await academicSchema.findOne({
      department: branch,
      "years.year": year,
    });

    if (!academic) {
      console.warn(
        "Academic structure not found for branch:",
        branch,
        "year:",
        year
      );
      return;
    }

    const yearBlock = academic.years.find((y) => y.year === year);
    if (!yearBlock) {
      console.warn(`Year ${year} not found in academic structure`);
      return;
    }

    // Find division with fewest students
    let targetDiv = yearBlock.divisions[0];
    for (const div of yearBlock.divisions) {
      if (div.students.length < targetDiv.students.length) {
        targetDiv = div;
      }
    }

    // Check if division exists and has space
    if (!targetDiv) {
      console.warn("No divisions found for year:", year);
      return;
    }

    if (targetDiv.students.length >= 50) {
      console.warn("All divisions are full for year:", year);
      return;
    }

    // Update the specific division
    await academicSchema.updateOne(
      {
        _id: academic._id,
        "years.year": year,
        "years.divisions.divisionName": targetDiv.divisionName,
      },
      {
        $addToSet: {
          "years.$[yearElem].divisions.$[div].students": student._id,
        },
      },
      {
        arrayFilters: [
          { "yearElem.year": year },
          { "div.divisionName": targetDiv.divisionName },
        ],
      }
    );

    console.log(
      `Successfully added student ${student.studentId} to division ${targetDiv.divisionName}`
    );
  } catch (error) {
    console.error("Error in handleApprovedStatus:", error);
    throw error;
  }
}

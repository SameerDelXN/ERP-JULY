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
  const validationErrors =[]
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
    console.log(jsonData.length);
    if (jsonData.length === 0) {
      return NextResponse.json(
        { error: "No data found in Excel file" },
        { status: 400 }
      );
    }
    // Map Excel columns to schema fields
    const fieldMappings = {
      DTEApplicationNumber: "dteApplicationNumber",
      FirstName: "firstName",
      MiddleName: "middleName",
      LastName: "lastName",
      FullName: "fullName",
      NameAsPerAadhar: "nameAsPerAadhar",
      Email: "email",
      Gender: "gender",
      PRN: "prn",
      AdmissionYear: "admissionYear",
      ProgramType: "programType",
      Year: "year",
      Branch: "branch",
      Shift: "shift",
      Round: "round",
      Quota: "quota",
      SeatType: "seatType",
      AdmissionCategoryasPerDTE: "admissionCategoryDTE",
      FeesCategory: "feesCategory",
      AdmissionType: "admissionType",
      CastAsPerLC: "casteAsPerLC",
      SubCastAsPerLC: "subCasteAsPerLC",
      Domicile: "domicile",
      Nationality: "nationality",
      ReligionAsPerLC: "religionAsPerLC",
      DateOfBirth: "dateOfBirth",
      MothersName: "motherName",
      FamilyIncome: "familyIncome",
      StudentWhatsappNo: "studentWhatsappNumber",
      FatherGuardianWhatsAppMobileNo: "fatherGuardianWhatsappNumber",
      MothersMobileNo: "motherMobileNumber",
      IsForeignNational: "isForeignNational",
      AddressLine: "address.addressLine",
      City: "address.city",
      State: "address.state",
      Pincode: "address.pincode",
      Country: "address.country",
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
      "dateOfBirth",
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
        // Skip if field is not in the row
        if (row[excelCol] === undefined || row[excelCol] === null) {
          continue;
        }

        try {
          // Handle special cases
          if (excelCol === "DateOfBirth") {
            // Handle both Excel date codes and string dates
            if (typeof row[excelCol] === "number") {
              const parsed = XLSX.SSF.parse_date_code(row[excelCol]);
              if (parsed) {
                const date = new Date(parsed.y, parsed.m - 1, parsed.d);
                // Format as YYYY-MM-DD
                const formattedDate = date.toISOString().split("T")[0];
                admissionData[schemaField] = formattedDate;
              } else {
                throw new Error("Invalid date format");
              }
            } else {
              // Try to parse string date (handles "YYYY-MM-DD", "MM/DD/YYYY", etc.)
              const date = new Date(row[excelCol]);
              if (isNaN(date.getTime())) {
                throw new Error("Invalid date format");
              }
              // Format as YYYY-MM-DD
              const formattedDate = date.toISOString().split("T")[0];
              admissionData[schemaField] = formattedDate;
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
        admissionData.isPrnGenerated = true;
        processedData.push(admissionData);
      }
    }
    console.log(validationErrors);

     const existingRecords = await admission.find({
      dteApplicationNumber: {
        $in: processedData.map((d) => d.dteApplicationNumber),
      },
    });

    const existingAppNumbers = new Set(
      existingRecords.map((r) => r.dteApplicationNumber)
    );

    const duplicates = processedData.filter((d) =>
      existingAppNumbers.has(d.dteApplicationNumber)
    );

    // Filter out duplicates from data to be inserted
    const dataToInsert = processedData.filter(
      (d) => !existingAppNumbers.has(d.dteApplicationNumber)
    );

    // If all records are duplicates
    if (dataToInsert.length === 0 && duplicates.length > 0) {
      return NextResponse.json(
        {
          error: "All records are duplicates",
          totalRecords: jsonData.length,
          duplicates: duplicates.map((d) => ({
            dteApplicationNumber: d.dteApplicationNumber,
            fullName: d.fullName,
          })),
        },
        { status: 400 }
      );
    }

    // Insert only non-duplicate records
    let result = [];
    if (dataToInsert.length > 0) {
      result = await admission.insertMany(dataToInsert, { ordered: false });
    }

    // Handle approved status for each inserted record
    for (const doc of result) {
      await handleApprovedStatus(doc, doc._id);
    }

    // Prepare response with duplicate information
    const response = {
      message: "Data imported successfully",
      totalRecords: jsonData.length,
      insertedCount: result.length,
      duplicateCount: duplicates.length,
      validationErrorCount: validationErrors.length,
    };

    // Add duplicate details if any
    if (duplicates.length > 0) {
      response.duplicates = duplicates.map((d) => ({
        dteApplicationNumber: d.dteApplicationNumber,
        fullName: d.fullName,
        rowNumber: jsonData.findIndex(
          (row) => row.DTEApplicationNumber === d.dteApplicationNumber
        ) + 2,
      }));
    }

    // Add validation errors if any
    if (validationErrors.length > 0) {
      response.validationErrors = validationErrors.map((err) => ({
        row: err.row,
        errors: err.errors,
      }));
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error("Error importing data:", error);
    
    // Handle bulk write errors (including duplicates)
    if (error.writeErrors) {
      const duplicates = error.writeErrors.map((err) => {
        const op = err.err.op;
        return {
          dteApplicationNumber: op.dteApplicationNumber,
          fullName: op.fullName,
          rowNumber: jsonData.findIndex(
            (row) => row.DTEApplicationNumber === op.dteApplicationNumber
          ) + 2,
          error: err.err.errmsg.includes('duplicate')
            ? 'Duplicate record'
            : 'Write error'
        };
      });

      return NextResponse.json(
        {
          error: "Partial import completed",
          message: `Imported ${error.result.result.nInserted} records, ${error.writeErrors.length} duplicates/errors encountered`,
          totalRecords: jsonData.length,
          insertedCount: error.result.result.nInserted,
          duplicates: duplicates,
          validationErrors: validationErrors || [],
        },
        { status: 207 } // 207 Multi-Status
      );
    }

    return NextResponse.json(
      {
        error: "Failed to import data",
        details: error.message,
        validationErrors: validationErrors || [],
      },
      { status: 500 }
    );
  }
}

// async function handleApprovedStatus(admissionData, admissionId) {
//   try {
//     const {
//       programType,
//       year,
//       branch,
//       fullName,
//       email,
//       studentWhatsappNumber,
//       dateOfBirth,
//       address,
//       isForeignNational,
//       nationality,
//     } = admissionData;

//     // Validate required fields for student creation
//     if (!programType || !year || !branch) {
//       throw new Error(
//         "Missing academic details (programType, year, or branch) required for student creation"
//       );
//     }

//     // Check/create student record
//     let student = await studentSchema.findOne({ admissionId });

//     if (!student) {
//       const studentCount = await studentSchema.countDocuments();
//       const studentId = `SCH${new Date().getFullYear()}-${String(
//         studentCount + 1
//       ).padStart(4, "0")}`;

//       student = await studentSchema.create({
//         studentId,
//         admissionId,
//         fullName,
//         email: email?.toLowerCase(),
//         mobileNumber: studentWhatsappNumber,
//         dateOfBirth,
//         address: address || {},
//         nationality,
//         isForeignNational: isForeignNational || false,
//         status: "active",
//         academicDetails: {
//           programType,
//           currentYear: year,
//           branch,
//         },
//       });
//     }

//     // Update academic record
//     const academic = await academicSchema.findOne({
//       department: branch,
//       "years.year": year,
//     });

//     if (!academic) {
//       console.warn(
//         "Academic structure not found for branch:",
//         branch,
//         "year:",
//         year
//       );
//       return;
//     }

//     const yearBlock = academic.years.find((y) => y.year === year);
//     if (!yearBlock) {
//       console.warn(`Year ${year} not found in academic structure`);
//       return;
//     }

//     // Find division with fewest students
//     let targetDiv = yearBlock.divisions[0];
//     for (const div of yearBlock.divisions) {
//       if (div.students.length < targetDiv.students.length) {
//         targetDiv = div;
//       }
//     }

//     // Check if division exists and has space
//     if (!targetDiv) {
//       console.warn("No divisions found for year:", year);
//       return;
//     }

//     if (targetDiv.students.length >= 50) {
//       console.warn("All divisions are full for year:", year);
//       return;
//     }

//     // Update the specific division
//     await academicSchema.updateOne(
//       {
//         _id: academic._id,
//         "years.year": year,
//         "years.divisions.divisionName": targetDiv.divisionName,
//       },
//       {
//         $addToSet: {
//           "years.$[yearElem].divisions.$[div].students": student._id,
//         },
//       },
//       {
//         arrayFilters: [
//           { "yearElem.year": year },
//           { "div.divisionName": targetDiv.divisionName },
//         ],
//       }
//     );

//     console.log(
//       `Successfully added student ${student.studentId} to division ${targetDiv.divisionName}`
//     );
//   } catch (error) {
//     console.error("Error in handleApprovedStatus:", error);
//     throw error;
//   }
// }

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
      gender,
      prn,
      motherName,
      fatherGuardianWhatsappNumber,
      motherMobileNumber,
      casteAsPerLC,
      domicile,
      religionAsPerLC,
      familyIncome,
      admissionYear,
      seatType,
      admissionCategoryDTE,
      feesCategory,
      admissionType,
    } = admissionData;

    // Validate required fields for student creation
    const requiredFields = {
      programType: "Program Type",
      year: "Year",
      branch: "Branch",
      fullName: "Full Name",
      email: "Email",
      studentWhatsappNumber: "Student WhatsApp Number",
      dateOfBirth: "Date of Birth",
      nationality: "Nationality",
    };

    const missingFields = [];
    for (const [field, displayName] of Object.entries(requiredFields)) {
      if (!admissionData[field]) {
        missingFields.push(displayName);
      }
    }

    if (missingFields.length > 0) {
      throw new Error(
        `Missing required fields for student creation: ${missingFields.join(
          ", "
        )}`
      );
    }

    // Check if student already exists for this admission
    const existingStudent = await studentSchema.findOne({ admissionId });
    if (existingStudent) {
      console.log(`Student already exists for admission ${admissionId}`);
      return existingStudent;
    }

    // Generate student ID (format: YYBRANCH####)
    const currentYearShort = new Date().getFullYear().toString().slice(-2);
    const branchCode = branch.substring(0, 3).toUpperCase();
    const studentCount = await studentSchema.countDocuments({ branch });
    const studentId = `${currentYearShort}${branchCode}${String(
      studentCount + 1
    ).padStart(4, "0")}`;

    // Prepare student data from Excel import
    const studentData = {
      studentId,
      admissionId,
      fullName,
      email: email.toLowerCase(),
      mobileNumber: studentWhatsappNumber,
      dateOfBirth,
      gender,
      address: address || {},
      nationality,
      isForeignNational: isForeignNational || false,
      status: "active",
      academicDetails: {
        programType,
        currentYear: year,
        branch,
      },
      prn: prn || generatePRN(branch, currentYearShort),
      motherName,
      fatherMobileNumber: fatherGuardianWhatsappNumber,
      motherMobileNumber,
      caste: casteAsPerLC,
      domicile,
      religion: religionAsPerLC,
      familyIncome,
      admissionYear,
      seatType,
      admissionCategory: admissionCategoryDTE,
      feesCategory,
      admissionType,
    };

    // Create student record
    const student = await studentSchema.create(studentData);

    // Add student to academic structure
    await addStudentToAcademicStructure(student, branch, year, programType);

    return student;
  } catch (error) {
    console.error("Error in handleApprovedStatus:", error);
    throw error;
  }
}

function generatePRN(branch, year) {
  const branchCode = branch.substring(0, 3).toUpperCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `PRN${year}${branchCode}${randomNum}`;
}

async function addStudentToAcademicStructure(
  student,
  branch,
  year,
  programType
) {
  try {
    // Find or create academic record for this branch and program type
    let academicRecord = await academicSchema.findOne({
      department: branch,
      programType: programType,
    });

    if (!academicRecord) {
      // Create new academic record if doesn't exist
      academicRecord = await academicSchema.create({
        department: branch,
        programType: programType,
        years: [
          {
            year,
            divisions: [
              {
                name: "A",
                students: [student._id],
                subjects: [],
                timetable: [],
                exams: [],
                attendance: [],
              },
            ],
          },
        ],
      });
      return;
    }

    // Find the year block or create it
    let yearBlock = academicRecord.years.find((y) => y.year === year);

    if (!yearBlock) {
      // Add new year if it doesn't exist
      await academicSchema.findByIdAndUpdate(academicRecord._id, {
        $push: {
          years: {
            year,
            divisions: [
              {
                name: "A",
                students: [student._id],
                subjects: [],
                timetable: [],
                exams: [],
                attendance: [],
              },
            ],
          },
        },
      });
      return;
    }

    // Find a division with available space (max 50 students)
    let targetDivision = yearBlock.divisions.find(
      (div) => div.students.length < 50
    );

    if (!targetDivision) {
      // Create new division if all are full (A, B, C, etc.)
      const newDivisionName = String.fromCharCode(
        65 + yearBlock.divisions.length
      );
      await academicSchema.findByIdAndUpdate(
        academicRecord._id,
        {
          $push: {
            "years.$[yearElem].divisions": {
              name: newDivisionName,
              students: [student._id],
              subjects: [],
              timetable: [],
              exams: [],
              attendance: [],
            },
          },
        },
        {
          arrayFilters: [{ "yearElem.year": year }],
        }
      );
    } else {
      // Add student to existing division
      await academicSchema.updateOne(
        {
          _id: academicRecord._id,
          "years.year": year,
          "years.divisions.name": targetDivision.name,
        },
        {
          $addToSet: {
            "years.$[yearElem].divisions.$[div].students": student._id,
          },
        },
        {
          arrayFilters: [
            { "yearElem.year": year },
            { "div.name": targetDivision.name },
          ],
        }
      );
    }
  } catch (error) {
    console.error("Error in addStudentToAcademicStructure:", error);
    throw error;
  }
}

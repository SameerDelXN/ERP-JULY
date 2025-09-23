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

    // Required fields
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

    // ✅ Allowed branches (same as enum in academicSchema)
    const allowedBranches = [
      "Computer Science Engineering",
      "Information Technology",
      "Electronics and Communication Engineering",
      "Mechanical Engineering",
      "Civil Engineering",
      "Electrical Engineering",
    ];

    const processedData = [];

    for (const [index, row] of jsonData.entries()) {
      const admissionData = {};

      // Required field check
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
          return NextResponse.json(
            { error: `Missing required field: ${field}` },
            { status: 400 }
          );
        }
      }

      // Map Excel → Schema
      for (const excelCol of Object.keys(fieldMappings)) {
        const schemaField = fieldMappings[excelCol];
        if (row[excelCol] === undefined || row[excelCol] === null) continue;

        if (excelCol === "DateOfBirth") {
          if (typeof row[excelCol] === "number") {
            const parsed = XLSX.SSF.parse_date_code(row[excelCol]);
            if (parsed) {
              const date = new Date(parsed.y, parsed.m - 1, parsed.d);
              admissionData[schemaField] = date.toISOString().split("T")[0];
            } else {
              return NextResponse.json(
                { error: "Invalid date format" },
                { status: 400 }
              );
            }
          } else {
            const date = new Date(row[excelCol]);
            if (isNaN(date.getTime())) {
              return NextResponse.json(
                { error: "Invalid date format" },
                { status: 400 }
              );
            }
            admissionData[schemaField] = date.toISOString().split("T")[0];
          }
        } else if (excelCol === "IsForeignNational") {
          admissionData[schemaField] =
            String(row[excelCol]).toLowerCase() === "yes";
        } else if (excelCol === "Email") {
          const email = String(row[excelCol]).trim();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
              { error: "Invalid email format" },
              { status: 400 }
            );
          }
          admissionData[schemaField] = email;
        } else if (
          excelCol === "StudentWhatsappNo" ||
          excelCol === "FatherGuardianWhatsAppMobileNo" ||
          excelCol === "MothersMobileNo"
        ) {
          const phone = String(row[excelCol]).replace(/\D/g, "");
          if (phone.length < 10) {
            return NextResponse.json(
              { error: "Invalid phone number" },
              { status: 400 }
            );
          }
          admissionData[schemaField] = phone;
        } else {
          admissionData[schemaField] =
            typeof row[excelCol] === "string"
              ? row[excelCol].trim()
              : row[excelCol];
        }
      }

      // ✅ Branch Validation
      if (admissionData.branch) {
        const normalizedBranch = String(admissionData.branch).trim().toLowerCase();
        const allowedNormalized = allowedBranches.map((b) => b.toLowerCase());

        if (!allowedNormalized.includes(normalizedBranch)) {
          return NextResponse.json(
            { error: "Enter valid branch" },
            { status: 400 }
          );
        } else {
          admissionData.branch =
            allowedBranches[allowedNormalized.indexOf(normalizedBranch)];
        }
      }

      // Mark defaults
      admissionData.status = "approved";
      admissionData.createdAt = new Date();
      admissionData.updatedAt = new Date();
      admissionData.isPrnGenerated = true;

      processedData.push(admissionData);
    }

    // ✅ Duplicate check
    const uniqueData = [];
    for (const data of processedData) {
      const exists = await admission.findOne({
        dteApplicationNumber: data.dteApplicationNumber,
      });
      if (exists) {
        return NextResponse.json(
          { error: "Duplicate DTE Application Number" },
          { status: 400 }
        );
      } else {
        uniqueData.push(data);
      }
    }

    // ✅ Insert valid data into DB
    if (uniqueData.length > 0) {
      await admission.insertMany(uniqueData);
    }

    return NextResponse.json({
      message: "Data imported successfully",
      count: uniqueData.length,
    });
  } catch (error) {
    console.error("Error importing data:", error);
    return NextResponse.json(
      { error: "Error importing data", details: error.message },
      { status: 500 }
    );
  }
}

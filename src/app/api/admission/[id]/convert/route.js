import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Admission from "@/app/models/admissionSchema";
import User from "@/app/models/userSchema";
import Student from "@/app/models/studentSchema"; // Assuming this model exists
import bcrypt from "bcryptjs";

export async function POST(req, { params }) {
    await connectToDatabase();
    const { id } = params;

    try {
        const admission = await Admission.findById(id);

        if (!admission) {
            return NextResponse.json({ error: "Admission not found" }, { status: 404 });
        }

        if (admission.status === "approved") {
            return NextResponse.json({ error: "Admission already approved/converted" }, { status: 400 });
        }

        // 1. Generate Student ID (Example: STU + Year + Random 4 digits)
        // In a real app, you might want a sequence counter.
        const yearSuffix = new Date().getFullYear().toString().slice(-2);
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const studentId = `STU${yearSuffix}${randomSuffix}`;

        // 2. Create User Record
        // Username = studentId
        // Password = studentId (hashed)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(studentId, salt);

        // Check if email already exists
        const existingUser = await User.findOne({ email: admission.email });
        if (existingUser) {
            return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
        }

        const newUser = await User.create({
            fullName: admission.fullName,
            email: admission.email, // Assuming mapping
            phone: admission.studentWhatsappNumber?.toString() || "",
            role: "student", // Ensure 'student' role exists in your dynamic roles or is allowed string
            password: hashedPassword,
            username: studentId, // If User model has username
            // additional fields...
        });

        // 3. Create Student Profile
        const newStudent = await Student.create({
            userId: newUser._id,
            studentId: studentId,
            firstName: admission.firstName || admission.fullName.split(' ')[0],
            lastName: admission.lastName || admission.fullName.split(' ').pop(),
            email: admission.email,
            academicDetails: {
                program: admission.programType,
                branch: admission.branch,
                year: admission.year,
            },
            admissionId: admission._id
            // Map other necessary fields from admission...
        });

        // Update User with Profile ID if needed (depends on your User/Profile link strategy)
        // newUser.profileId = newStudent._id;
        // await newUser.save();

        // 4. Update Admission Status
        admission.status = "approved";
        admission.prn = studentId; // Or specific PRN logic if different
        admission.isPrnGenerated = true;
        await admission.save();

        return NextResponse.json({
            message: "Converted successfully",
            studentId: studentId,
            userId: newUser._id
        });

    } catch (err) {
        console.error("Conversion Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

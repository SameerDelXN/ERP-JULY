// src/app/api/upload/route.js
import { NextResponse } from "next/server";
import cloudinary from "@/app/lib/cloudinary";
import { connectToDatabase } from "@/app/lib/mongodb";
import Note from "@/app/models/noteSchema";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const file = formData.get("files");
    const title = formData.get("title");
    const description = formData.get("description");
    const subject = formData.get("subject");
    const year = formData.get("year");
    const teacherId = formData.get("teacherId");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file → Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder: "notes" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    // Save to MongoDB
    await connectToDatabase();
    const note = await Note.create({
      title,
      description,
      category: subject,
      link: uploadResponse.secure_url,
      fileUrl: uploadResponse.secure_url,
      uploadedBy: teacherId,
    });

    // ✅ Return a proper JSON with message
    return new Response(
      JSON.stringify({
        success: true,
        note,
        message: `File "${file.name}" uploaded successfully!`, // show actual file name
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to upload", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

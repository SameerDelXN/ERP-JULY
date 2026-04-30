import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import SystemSetting from '@/models/systemSetting';

export async function GET() {
  try {
    await connectToDatabase();

    // Get or create default settings
    let settings = await SystemSetting.findOne({});
    if (!settings) {
      settings = await SystemSetting.create({
        systemConfig: {
          collegeName: 'My College',
          academicYear: '2025-2026',
          language: 'en',
          allowRegistrations: true,
          defaultRole: 'student'
        }
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error fetching system settings:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectToDatabase();
    const body = await req.json();

    let settings = await SystemSetting.findOne({});

    if (!settings) {
      settings = new SystemSetting({});
    }

    // Update systemConfig fields if provided
    if (body.instituteName !== undefined) {
      settings.systemConfig.collegeName = body.instituteName;
    }
    if (body.academicYear !== undefined) {
      settings.systemConfig.academicYear = body.academicYear;
    }
    if (body.language !== undefined) {
      settings.systemConfig.language = body.language;
    }
    if (body.allowRegistrations !== undefined) {
      settings.systemConfig.allowRegistrations = body.allowRegistrations;
    }

    settings.updatedAt = Date.now();
    await settings.save();

    return NextResponse.json({ success: true, settings, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating system settings:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

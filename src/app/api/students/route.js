import { connectToDatabase } from '@/app/lib/mongodb';
import studentSchema from '@/app/models/studentSchema';
import { NextResponse } from 'next/server';


export async function GET(request) {
  try {
    await connectToDatabase();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search');
    const sortField = searchParams.get('sort') || 'createdAt';
    const sortOrder = searchParams.get('order') === 'desc' ? -1 : 1;

    // Build query
    const query = {};
    
    // Add search filter if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count for pagination
    const total = await studentSchema.countDocuments(query);

    // Fetch students with pagination and sorting
    const students = await studentSchema.find(query, { admissionId: 0 })
      .sort({ [sortField]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: students,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }, { status: 200 });

  } catch (error) {
    console.error('[GET_ALL_STUDENTS_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
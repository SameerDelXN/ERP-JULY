//GET route handler to fetch number of admissions 
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import admissionSchema from '../../../models/admissionSchema';

export async function GET() {
  try {
    await connectToDatabase();

    const total = await admissionSchema.countDocuments();
    const pending = await admissionSchema.countDocuments({ status: 'Pending' });
    const approved = await admissionSchema.countDocuments({ status: 'Approved' });
    const rejected = await admissionSchema.countDocuments({ status: 'Rejected' });

    return NextResponse.json({
      total,
      pending,
      approved,
      rejected
    }, { status: 200 });

  } catch (error) {
    console.error('Admission count GET error:', error);
    return NextResponse.json({
      message: 'Server error',
      error: error.message
    }, { status: 500 });
  }
}

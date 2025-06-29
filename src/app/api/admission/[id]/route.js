import { connectToDatabase } from '../../../lib/mongodb';
import admissionSchema from '../../../models/admissionSchema';

// PUT - Update admission by ID (from params)
export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const updateData = await req.json();
    const { id: admissionId } = params;

    if (!admissionId || !updateData || typeof updateData !== 'object') {
      return new Response(JSON.stringify({
        message: 'Missing or invalid admissionId or update data'
      }), { status: 400 });
    }

    const updatedAdmission = await admissionSchema.findByIdAndUpdate(
      admissionId,
      updateData,
      { new: true }
    );

    if (!updatedAdmission) {
      return new Response(JSON.stringify({
        message: 'Admission not found'
      }), { status: 404 });
    }

    return new Response(JSON.stringify({
      message: 'Admission updated successfully',
      data: updatedAdmission
    }), { status: 200 });

  } catch (error) {
    console.error('Admission PUT error:', error);
    return new Response(JSON.stringify({
      message: 'Server error during update',
      error: error.message
    }), { status: 500 });
  }
}

// DELETE - Delete admission by ID (from params)
export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const { id: admissionId } = params;

    if (!admissionId) {
      return new Response(JSON.stringify({
        message: 'Admission ID is required'
      }), { status: 400 });
    }

    const deletedAdmission = await admissionSchema.findByIdAndDelete(admissionId);

    if (!deletedAdmission) {
      return new Response(JSON.stringify({
        message: 'Admission not found'
      }), { status: 404 });
    }

    return new Response(JSON.stringify({
      message: 'Admission deleted successfully',
      data: deletedAdmission
    }), { status: 200 });

  } catch (error) {
    console.error('Admission DELETE error:', error);
    return new Response(JSON.stringify({
      message: 'Server error during deletion',
      error: error.message
    }), { status: 500 });
  }
}

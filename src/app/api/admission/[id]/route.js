import { connectToDatabase } from '../../../lib/mongodb';
import admissionSchema from '../../../models/admissionSchema';

// PUT - Update admission by ID (from params)
import studentSchema from '../../../models/studentSchema';
import academicSchema from '../../../models/academicSchema';

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

    // 1. Update admission
    const updatedAdmission = await admissionSchema.findByIdAndUpdate(
      admissionId,
      updateData,
      { new: true }
    );

    if (!updatedAdmission) {
      return new Response(JSON.stringify({ message: 'Admission not found' }), { status: 404 });
    }

    // 2. Only proceed if status is approved
    if (updateData.status === 'approved') {
      const department = updatedAdmission.courseName; // department = courseName
      const rawYear = updatedAdmission.yearOfAdmission; // e.g. "1st Year"
      const year = rawYear?.split(" ")[0]; // "1st", "2nd", etc.

      if (!department || !year) {
        return new Response(JSON.stringify({
          message: 'Cannot determine department or year from admission data'
        }), { status: 400 });
      }

      // Check if student already exists
      let student = await studentSchema.findOne({ admissionId: updatedAdmission._id });

      if (!student) {
        const studentCount = await studentSchema.countDocuments();
        const studentId = `SCH${new Date().getFullYear()}-${String(studentCount + 1).padStart(3, '0')}`;

        student = await studentSchema.create({
          studentId,
          admissionId: updatedAdmission._id,
          fullName: updatedAdmission.fullName,
          email: updatedAdmission.email,
          mobileNumber: updatedAdmission.mobileNumber,
          dateOfBirth: updatedAdmission.dateOfBirth,
          address: {
            addressLine: updatedAdmission.addressLine,
            city: updatedAdmission.city,
            state: updatedAdmission.state,
            pincode: updatedAdmission.pincode,
            country: updatedAdmission.country,
          },
          status: 'active',
        });
      }

      // Find academic record
      const academic = await academicSchema.findOne({
        department,
        years: { $elemMatch: { year, 'divisions.students': { $exists: true } } }
      });

      if (!academic) {
        return new Response(JSON.stringify({
          message: 'Academic record not found for department and year'
        }), { status: 404 });
      }

      // Find the correct year and a division with space
      const yearObj = academic.years.find(y => y.year === year);
      const division = yearObj?.divisions?.find(div => div.students.length < 50);

      if (!division) {
        return new Response(JSON.stringify({
          message: 'No division with available capacity found'
        }), { status: 400 });
      }

      // Avoid duplicate
      if (!division.students.some(s => s.equals(student._id))) {
        division.students.push(student._id);
        await academic.save();
      }
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
      }), {
        status: 400
      });
    }

    const deletedAdmission = await admissionSchema.findByIdAndDelete(admissionId);

    if (!deletedAdmission) {
      return new Response(JSON.stringify({
        message: 'Admission not found'
      }), {
        status: 404
      });
    }

    return new Response(JSON.stringify({
      message: 'Admission deleted successfully',
      data: deletedAdmission
    }), {
      status: 200
    });

  } catch (error) {
    console.error('Admission DELETE error:', error);
    return new Response(JSON.stringify({
      message: 'Server error during deletion',
      error: error.message
    }), {
      status: 500
    });
  }
}

//PUT and DELETE route handler to update and delete enquiry based on id

import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import mongoose from 'mongoose';
import enquirySchema from '../../../models/enquirySchema';
import admissionSchema from '../../../models/admissionSchema';

export async function PUT(req, context) {
  try {
    await connectToDatabase();

    const { params } = context;
    const { id } = params;
    const body = await req.json();
    const { status, counsellorId } = body;

    const updateFields = {};
    const validStatuses = ['New', 'In Progress', "Contacted",'Converted', 'Lost'];

    // Validate status
    if (status) {
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { message: 'Invalid status value' },
          { status: 400 }
        );
      }
      updateFields.status = status;
    }

    // Validate counsellorId
    if (counsellorId) {
      if (!mongoose.Types.ObjectId.isValid(counsellorId)) {
        return NextResponse.json(
          { message: 'Invalid counsellorId' },
          { status: 400 }
        );
      }
      updateFields.counsellorId = counsellorId;
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { message: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const updatedEnquiry = await enquirySchema.findByIdAndUpdate(id, updateFields, { new: true });
    console.log(updatedEnquiry)
    if (!updatedEnquiry) {
      return NextResponse.json({ message: 'Enquiry not found' }, { status: 404 });
    }

    // If status is converted, create a partially filled admission form
    if (status === 'Converted') {
      const existingAdmission = await admissionSchema.findOne({
        first: updatedEnquiry.first,
        last: updatedEnquiry.last,
        parentMobile: updatedEnquiry.phone
      });

      if (!existingAdmission) {
        const newAdmission = new admissionSchema({
          first: updatedEnquiry.first,
          middle: updatedEnquiry.middle,
          last: updatedEnquiry.last,
          parentMobile: updatedEnquiry.phone,
          parentEmail: updatedEnquiry.email,
          enquiryId: updatedEnquiry._id
        });

        await newAdmission.save();
      }
    }

    return NextResponse.json({
      message: 'Enquiry updated successfully',
      enquiry: updatedEnquiry
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating enquiry:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}


// DELETE /api/enquiry/[id]
export async function DELETE(_, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;

    const deleted = await enquirySchema.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({
        message: 'Enquiry not found'
      }, {
        status: 404
      });
    }

    return NextResponse.json({
      message: 'Enquiry deleted successfully'
    }, {
      status: 200
    });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    return NextResponse.json({
      message: 'Server error'
    }, {
      status: 500
    });
  }
}



import mongoose from 'mongoose';

const { Schema, model, models, Types } = mongoose;

const EnquirySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: String,
  courseInterested: String,
  source: {
    type: String,
    enum: ['Website', 'Call', 'Walk-in', 'Campaign'],
  },
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Converted', 'Lost'],
    default: 'New',
  },
  counsellorId: {
    type: Types.ObjectId,
    ref: 'User', // optional: reference to a User model
  },
  followUps: [
    {
      date: Date,
      note: String,
      updatedBy: {
        type: Types.ObjectId,
        ref: 'User', // optional: reference to a User model
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default models.Enquiry || model('Enquiry', EnquirySchema);

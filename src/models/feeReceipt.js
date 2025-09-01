// models/feeReceipt.js
import mongoose from 'mongoose';

const feeReceiptSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  receiptNumber: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  amountPaid: {
    type: Number,
    required: true
  },
  paymentMode: {
    type: String,
    enum: ['Cash', 'Online', 'UPI', 'Bank Transfer', 'Cheque'],
    required: true
  },
  remarks: {
    type: String
  },
  academicYear: {
    type: String,
    required: true
  }
});

export const FeeReceipt = mongoose.models.FeeReceipt || mongoose.model("FeeReceipt", feeReceiptSchema);

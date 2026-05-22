import mongoose from 'mongoose';

const installmentPlanSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  installments: {
    type: [Number], // Array of installment amounts
    required: true
  },
  dueDates: {
    type: [Date], // Array of due dates for each installment
    default: []
  },
  totalFee: {
    type: Number,
    required: true
  },
  numberOfInstallments: {
    type: Number,
    required: true,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.InstallmentPlan || mongoose.model('InstallmentPlan', installmentPlanSchema);

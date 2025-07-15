import mongoose from 'mongoose';

const installmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  totalAmount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  paidAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'paid', 'partial'], default: 'pending' }
}, { timestamps: true });

export default mongoose.models.Installment || mongoose.model('Installment', installmentSchema);

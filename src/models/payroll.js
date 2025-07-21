import mongoose from 'mongoose';

const salarySchema = new mongoose.Schema({
   staffId: {
    //type: String,  ✅ This ensures it's a custom string like "STF010"
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Staff'
  },
  name: { type: String, required: true },
  baseSalary: { type: Number, required: true },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  leaveDeduction: { type: Number, default: 0 }, // ✅ Add this if you want leave deduction in salary too
  netSalary: { type: Number }, // Optional: track net salary here too
}, //{ timestamps: true }
);

const payslipSchema = new mongoose.Schema({
   staffId: {
    type: String, // ✅ This ensures it's a custom string like "STF010"
    required: true,
    ref: 'Staff'
  },
  name: { type: String, required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true }, // ✅ Add this for clarity
  generatedDate: { type: Date, default: Date.now },
  baseSalary: Number,
  allowances: Number,
  deductions: Number,
  leaveDeduction: { type: Number, default: 0 }, // ✅ NEW FIELD
  netSalary: Number
}, { timestamps: true });

export const Salary = mongoose.models.Salary || mongoose.model('Salary', salarySchema);
export const Payslip = mongoose.models.Payslip || mongoose.model('Payslip', payslipSchema);

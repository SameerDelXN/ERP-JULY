import mongoose from 'mongoose';

const salarySchema = new mongoose.Schema({
<<<<<<< HEAD
  staffId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Staff', 
    required: true 
=======
   staffId: {
    //type: String,  ✅ This ensures it's a custom string like "STF010"
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Staff'
>>>>>>> cfda5fd7224e3c95f1566146599b102b9cbff159
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
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Staff', 
    required: true 
  },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  dateOfIssue: { type: Date, default: Date.now },

  earnings: {
    basic: Number,
    hra: Number,
    da: Number,
    specialAllowance: Number,
    bonus: Number,
    other: Number
  },

  deductions: {
    pf: Number,
    tds: Number,
    loan: Number,
    leave: Number,
    other: Number
  },

  grossEarnings: Number,
  totalDeductions: Number,
  netSalary: Number,

  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending'],
    default: 'Pending'
  }
}, { timestamps: true });


export const Salary = mongoose.models.Salary || mongoose.model('Salary', salarySchema);
export const Payslip = mongoose.models.Payslip || mongoose.model('Payslip', payslipSchema);

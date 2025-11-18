import mongoose from "mongoose";

const feeStructureSchema = new mongoose.Schema(
  {
    programType: {
      type: String,
      required: true,
      trim: true,
    },

    departmentName: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: String,
      required: true,
    },

    caste: {
      type: String,
      enum: ["general", "obc", "sc", "st", "ews"],
      default: "general",
    },

    // LIST OF FEE ITEMS
 fees: [
  {
    feeName: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
  },
],


    // AUTO-CALCULATED TOTAL FEES
    totalFees: {
      type: Number,
      required: true,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// PREVENT DUPLICATE RECORD ENTRIES
feeStructureSchema.index(
  { programType: 1, departmentName: 1, year: 1, caste: 1 },
  { unique: true }
);

// AUTO-CALCULATE TOTAL BEFORE SAVE
feeStructureSchema.pre("save", function (next) {
  if (this.fees && Array.isArray(this.fees)) {
    this.totalFees = this.fees.reduce((sum, item) => sum + item.amount, 0);
  }
  next();
});

// MODEL EXPORT
export default mongoose.models.FeeStructure ||
  mongoose.model("FeeStructure", feeStructureSchema);

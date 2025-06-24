import mongoose from "mongoose";
 //mongodb+srv://delxn:delxn@cluster0.9huz0ct.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please Provide a Username"],
      unique: true,
      trim: true,
    },
 
    email: {
      type: String,
      required: [true, "Please Provide a Email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
 
    password: {
      type: String,
      required: [true, "Please Provide a Password"],
      minlength: 8,
    },
 
    role: {
      type: String,
      enum: ["admin", "student", "staff", "parents"],
      default: "student",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastLogin: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    otpCode: String,
    otpExpires: Date,
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "role",
    },
  },
  { timestamps: true }
);
 
const User = mongoose.models.User || mongoose.model("User", userSchema);
 
export default User;
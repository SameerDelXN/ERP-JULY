//database schema for users
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please provide your full name"],
    },

    email: {
      type: String,
      required: [true, "Please provide an email address"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Please provide a phone number"],
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
    },

    role: {
      type: String,
      enum: ["admin", "staff", "teacher","hod"],
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
    sessionToken:{
      type:String
    }
  },
  { timestamps: true }
);
delete mongoose.models.user
const user = mongoose.models.user || mongoose.model("user", userSchema);

export default user;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please provide your full name"],
      trim: true,
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
      enum: ["admin", "student", "staff", "parents"],
      default: "student",
    },
    agreeToTerms: {
      type: Boolean,
      required: true
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

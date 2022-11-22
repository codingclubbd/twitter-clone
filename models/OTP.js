//dependencies
const mongoose = require("mongoose");

// OTP schema
const OTPSchema = new mongoose.Schema(
  {
    OTP: {
      type: Number,
      required: true,
      minLength: 4,
      trim: true,
    },
    status: {
      type: Boolean,
      default: false,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    expireIn: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// model
const OTP = mongoose.model("OTP", OTPSchema);

// exports
module.exports = OTP;

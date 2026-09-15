import mongoose from 'mongoose';

/**
 * Farmer Schema
 * Represents a registered rural farmer linked to exactly one Village.
 * Uses mobile-number + OTP based authentication.
 */
const farmerSchema = new mongoose.Schema(
  {
    farmerId: {
      type: String,
      required: [true, 'Farmer ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
      unique: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian mobile number'],
      index: true,
    },
    villageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Village',
      required: [true, 'Village reference is required'],
      index: true,
    },
    auth: {
      otp: {
        type: String,
        default: '123456', // Prototype default, easily switchable to dynamic hash/string
        select: false,     // Excluded from default queries for security
      },
      otpExpiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry window
        select: false,
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      lastLoginAt: {
        type: Date,
      },
    },
    status: {
      type: String,
      enum: {
        values: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
        message: 'Status must be ACTIVE, INACTIVE, or SUSPENDED',
      },
      default: 'ACTIVE',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual relationships
farmerSchema.virtual('requests', {
  ref: 'Request',
  localField: '_id',
  foreignField: 'farmerId',
});

farmerSchema.virtual('transactions', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: 'farmerId',
});

// Compound Indexes for fast queries
farmerSchema.index({ villageId: 1, status: 1 });
farmerSchema.index({ mobileNumber: 1, status: 1 });

const Farmer = mongoose.models.Farmer || mongoose.model('Farmer', farmerSchema);

export default Farmer;

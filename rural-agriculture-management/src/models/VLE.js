import mongoose from 'mongoose';

/**
 * VLE (Village Level Entrepreneur) Schema
 * Represents an entrepreneur managing machinery/stock and serving farmers in a Village.
 */
const vleSchema = new mongoose.Schema(
  {
    vleId: {
      type: String,
      required: [true, 'VLE ID is required'],
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
    centerName: {
      type: String,
      trim: true,
      default: '',
      maxlength: [120, 'Center name cannot exceed 120 characters'],
    },
    auth: {
      password: {
        type: String,
        select: false, // For credential-based login if used
      },
      otp: {
        type: String,
        default: '123456',
        select: false,
      },
      otpExpiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 10 * 60 * 1000),
        select: false,
      },
      isVerified: {
        type: Boolean,
        default: true,
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
vleSchema.virtual('machineryStock', {
  ref: 'Machinery',
  localField: '_id',
  foreignField: 'vleId',
});

vleSchema.virtual('incomingRequests', {
  ref: 'Request',
  localField: '_id',
  foreignField: 'vleId',
});

vleSchema.virtual('transactions', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: 'vleId',
});

// Compound Indexes for query optimization
vleSchema.index({ villageId: 1, status: 1 });
vleSchema.index({ mobileNumber: 1, status: 1 });

const VLE = mongoose.models.VLE || mongoose.model('VLE', vleSchema);

export default VLE;

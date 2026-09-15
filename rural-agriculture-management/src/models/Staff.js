import mongoose from 'mongoose';

/**
 * Staff Schema
 * Represents internal organizational staff who manage villages, oversee operations, and monitor VLEs.
 * Staff accounts are organization-controlled and do not support public signup.
 */
const staffSchema = new mongoose.Schema(
  {
    staffId: {
      type: String,
      required: [true, 'Staff ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Staff full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Staff email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password hash is required'],
      minlength: [8, 'Password hash must be valid'],
      select: false, // Never return password in queries by default
    },
    role: {
      type: String,
      enum: {
        values: ['ADMIN', 'FIELD_OFFICER', 'SUPERVISOR'],
        message: 'Role must be ADMIN, FIELD_OFFICER, or SUPERVISOR',
      },
      default: 'FIELD_OFFICER',
      index: true,
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
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for staff lookup and authentication
staffSchema.index({ email: 1, status: 1 });
staffSchema.index({ staffId: 1, status: 1 });

const Staff = mongoose.models.Staff || mongoose.model('Staff', staffSchema);

export default Staff;

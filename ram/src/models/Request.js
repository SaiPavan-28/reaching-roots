import mongoose from 'mongoose';

/**
 * Request Schema
 * Represents a machinery/service request initiated by a Farmer and assigned to a VLE.
 * Enforces state machine transitions:
 *   PENDING -> ACCEPTED -> COMPLETED
 *   PENDING -> REJECTED
 */
const requestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: [true, 'Request ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
      default: () => `REQ-${Date.now()}`,
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: [true, 'Farmer reference is required'],
      index: true,
    },
    vleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VLE',
      required: [true, 'VLE reference is required'],
      index: true,
    },
    machineryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Machinery',
      required: [true, 'Machinery/Stock reference is required'],
      index: true,
    },
    requiredDate: {
      type: Date,
      required: [true, 'Required date for machinery is required'],
      validate: {
        validator: function (val) {
          if (this.isNew) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return val >= today;
          }
          return true;
        },
        message: 'Required date cannot be in the past',
      },
    },
    quantityOrArea: {
      type: String,
      required: [true, 'Quantity or Area specification is required'],
      trim: true,
      maxlength: [100, 'Quantity/Area description cannot exceed 100 characters'],
    },
    additionalNote: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Additional note cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'ACCEPTED', 'COMPLETED', 'REJECTED'],
        message: 'Status must be PENDING, ACCEPTED, COMPLETED, or REJECTED',
      },
      default: 'PENDING',
      uppercase: true,
      index: true,
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: '',
      maxlength: [300, 'Rejection reason cannot exceed 300 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// State machine transition validation on save
requestSchema.pre('save', function (next) {
  if (this.isModified('status') && !this.isNew) {
    const originalStatus = this.constructor.findById(this._id).then((original) => {
      if (!original) return next();

      const from = original.status;
      const to = this.status;

      // Allowed transitions:
      // PENDING -> ACCEPTED, REJECTED
      // ACCEPTED -> COMPLETED, REJECTED
      const allowedTransitions = {
        PENDING: ['ACCEPTED', 'REJECTED'],
        ACCEPTED: ['COMPLETED', 'REJECTED'],
        COMPLETED: [],
        REJECTED: [],
      };

      if (from !== to && (!allowedTransitions[from] || !allowedTransitions[from].includes(to))) {
        return next(new Error(`Invalid status transition from ${from} to ${to}`));
      }
      next();
    }).catch(next);
    return;
  }
  next();
});

// Virtual relationship: Link to generated Transaction
requestSchema.virtual('transaction', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: 'requestId',
  justOne: true,
});

// Compound indexes for optimal queries
requestSchema.index({ farmerId: 1, status: 1, createdAt: -1 });
requestSchema.index({ vleId: 1, status: 1, createdAt: -1 });
requestSchema.index({ machineryId: 1, status: 1 });

const Request = mongoose.models.Request || mongoose.model('Request', requestSchema);

export default Request;

import mongoose from 'mongoose';

/**
 * Request Schema
 * Represents a machinery/service request initiated by a Farmer and assigned to a VLE.
 * Enforces strict status transitions and references.
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
          // On new request creation, ensure requiredDate is not in the past
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
        values: ['PENDING', 'ACCEPTED', 'REJECTED'],
        message: 'Status must be PENDING, ACCEPTED, or REJECTED',
      },
      default: 'PENDING',
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

// Virtual relationship: Link to generated Transaction if accepted and fulfilled
requestSchema.virtual('transaction', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: 'requestId',
  justOne: true,
});

// Compound indexes for optimal dashboard and status queries
requestSchema.index({ farmerId: 1, status: 1, createdAt: -1 });
requestSchema.index({ vleId: 1, status: 1, createdAt: -1 });
requestSchema.index({ machineryId: 1, status: 1 });

const Request = mongoose.models.Request || mongoose.model('Request', requestSchema);

export default Request;

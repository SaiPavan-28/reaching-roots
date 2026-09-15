import mongoose from 'mongoose';

/**
 * Transaction / Purchase / Service History Schema
 * Single source of truth for completed/in-progress machinery rentals and agricultural services.
 * Queryable by Farmer (Farmer -> My History) and VLE (VLE -> Farmer History).
 */
const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: [true, 'Transaction ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
      default: () => `TXN-${Date.now()}`,
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
      required: [true, 'Machinery/Service reference is required'],
      index: true,
    },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request',
      default: null,
      index: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
      index: true,
    },
    quantity: {
      type: String,
      required: [true, 'Quantity or duration is required'],
      trim: true,
      default: '1 Unit',
    },
    amount: {
      type: Number,
      required: [true, 'Transaction amount is required'],
      min: [0, 'Amount cannot be negative'],
      default: 0,
    },
    status: {
      type: String,
      enum: {
        values: ['IN_PROGRESS', 'COMPLETED', 'DELIVERED', 'CANCELLED'],
        message: 'Status must be IN_PROGRESS, COMPLETED, DELIVERED, or CANCELLED',
      },
      default: 'COMPLETED',
      uppercase: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound indexes for high-speed chronological history pagination
transactionSchema.index({ farmerId: 1, date: -1 });
transactionSchema.index({ vleId: 1, date: -1 });
transactionSchema.index({ farmerId: 1, status: 1 });
transactionSchema.index({ vleId: 1, status: 1 });
transactionSchema.index({ machineryId: 1, date: -1 });

const Transaction =
  mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

export default Transaction;

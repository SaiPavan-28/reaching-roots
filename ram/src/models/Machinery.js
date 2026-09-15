import mongoose from 'mongoose';

/**
 * Machinery / Stock Schema
 * Represents agricultural equipment or stock owned/managed by a VLE.
 * Enforces availableUnits <= totalUnits and availableUnits >= 0.
 */
const machinerySchema = new mongoose.Schema(
  {
    machineryId: {
      type: String,
      required: [true, 'Machinery ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
      default: () => `MACH-${Date.now()}`,
    },
    name: {
      type: String,
      required: [true, 'Machinery/Stock name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [120, 'Name cannot exceed 120 characters'],
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      default: 'Other',
      index: true,
    },
    vleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VLE',
      required: [true, 'VLE reference is required'],
      index: true,
    },
    totalUnits: {
      type: Number,
      required: [true, 'Total units is required'],
      min: [0, 'Total units cannot be negative'],
      default: 1,
    },
    availableUnits: {
      type: Number,
      required: [true, 'Available units is required'],
      min: [0, 'Available units cannot be negative'],
      validate: {
        validator: function (val) {
          const total = this.totalUnits !== undefined ? this.totalUnits : (this.totalQuantity !== undefined ? this.totalQuantity : 0);
          return val <= total;
        },
        message: 'Available units ({VALUE}) cannot exceed total units',
      },
      default: 1,
    },
    // Compatibility aliases with totalQuantity / availableQuantity
    totalQuantity: {
      type: Number,
      min: [0, 'Total quantity cannot be negative'],
    },
    availableQuantity: {
      type: Number,
      min: [0, 'Available quantity cannot be negative'],
    },
    rateDescription: {
      type: String,
      trim: true,
      default: '',
      maxlength: [100, 'Rate description cannot exceed 100 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['AVAILABLE', 'OUT_OF_STOCK', 'MAINTENANCE', 'DECOMMISSIONED'],
        message: 'Invalid machinery status',
      },
      default: 'AVAILABLE',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-validate hook: Sync units and quantity fields, and validate stock bounds
machinerySchema.pre('validate', function (next) {
  // Sync totalUnits & totalQuantity
  if (this.totalUnits === undefined && this.totalQuantity !== undefined) {
    this.totalUnits = this.totalQuantity;
  }
  if (this.totalQuantity === undefined && this.totalUnits !== undefined) {
    this.totalQuantity = this.totalUnits;
  }

  // Sync availableUnits & availableQuantity
  if (this.availableUnits === undefined && this.availableQuantity !== undefined) {
    this.availableUnits = this.availableQuantity;
  }
  if (this.availableQuantity === undefined && this.availableUnits !== undefined) {
    this.availableQuantity = this.availableUnits;
  }

  // Enforce availableUnits <= totalUnits
  if (this.availableUnits > this.totalUnits) {
    return next(new Error(`Available units (${this.availableUnits}) cannot exceed total units (${this.totalUnits})`));
  }
  if (this.availableUnits < 0) {
    return next(new Error(`Available units (${this.availableUnits}) cannot be negative`));
  }

  next();
});

// Pre-save hook: Automatically update status based on available units
machinerySchema.pre('save', function (next) {
  if (this.availableUnits === 0 && this.status === 'AVAILABLE') {
    this.status = 'OUT_OF_STOCK';
  } else if (this.availableUnits > 0 && this.status === 'OUT_OF_STOCK') {
    this.status = 'AVAILABLE';
  }
  next();
});

// Virtual relationships
machinerySchema.virtual('requests', {
  ref: 'Request',
  localField: '_id',
  foreignField: 'machineryId',
});

machinerySchema.virtual('transactions', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: 'machineryId',
});

// Compound indexes for fast lookups
machinerySchema.index({ vleId: 1, status: 1 });
machinerySchema.index({ vleId: 1, category: 1 });
machinerySchema.index({ name: 'text', category: 'text' });

const Machinery = mongoose.models.Machinery || mongoose.model('Machinery', machinerySchema);

export default Machinery;

import mongoose from 'mongoose';

/**
 * Machinery / Stock Schema
 * Represents agricultural equipment or stock owned/managed by a VLE.
 * Tracks total and available stock levels.
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
      enum: {
        values: [
          'Tractor',
          'Harvester',
          'Sprayer',
          'Tiller',
          'Seeder',
          'Pump',
          'Thresher',
          'Plow',
          'Rotavator',
          'Other',
        ],
        message: '{VALUE} is not a supported machinery category',
      },
      index: true,
    },
    vleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VLE',
      required: [true, 'VLE reference is required'],
      index: true,
    },
    totalQuantity: {
      type: Number,
      required: [true, 'Total quantity is required'],
      min: [0, 'Total quantity cannot be negative'],
    },
    availableQuantity: {
      type: Number,
      required: [true, 'Available quantity is required'],
      min: [0, 'Available quantity cannot be negative'],
      validate: {
        validator: function (val) {
          // 'this' refers to the document being validated (on create/save)
          if (this.totalQuantity !== undefined && this.totalQuantity !== null) {
            return val <= this.totalQuantity;
          }
          return true;
        },
        message: 'Available quantity ({VALUE}) cannot exceed total quantity',
      },
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

// Pre-save hook: Automatically update status based on available stock
machinerySchema.pre('save', function (next) {
  if (this.availableQuantity === 0 && this.status === 'AVAILABLE') {
    this.status = 'OUT_OF_STOCK';
  } else if (this.availableQuantity > 0 && this.status === 'OUT_OF_STOCK') {
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

// Compound indexes for fast lookups by VLE and status/category
machinerySchema.index({ vleId: 1, status: 1 });
machinerySchema.index({ vleId: 1, category: 1 });
machinerySchema.index({ name: 'text', category: 'text' });

const Machinery = mongoose.models.Machinery || mongoose.model('Machinery', machinerySchema);

export default Machinery;

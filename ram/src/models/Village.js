import mongoose from 'mongoose';

/**
 * Village Schema
 * Represents a rural village entity managed by Staff.
 * Referenced by Farmers and VLEs.
 */
const villageSchema = new mongoose.Schema(
  {
    villageId: {
      type: String,
      required: [true, 'Village ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Village name is required'],
      trim: true,
      minlength: [2, 'Village name must be at least 2 characters'],
      maxlength: [100, 'Village name cannot exceed 100 characters'],
      index: true,
    },
    district: {
      type: String,
      trim: true,
      default: '',
    },
    panchayat: {
      type: String,
      trim: true,
      default: '',
    },
    waterResources: {
      type: String,
      required: [true, 'Water resources description is required'],
      trim: true,
      maxlength: [500, 'Water resources description cannot exceed 500 characters'],
    },
    acresUnderCultivation: {
      type: Number,
      required: [true, 'Acres under cultivation is required'],
      min: [0, 'Acres under cultivation cannot be negative'],
      default: 0,
    },
    farmersCount: {
      type: Number,
      min: [0, 'Farmers count cannot be negative'],
      default: 0,
    },
    status: {
      type: String,
      enum: {
        values: ['ACTIVE', 'INACTIVE'],
        message: 'Status must be either ACTIVE or INACTIVE',
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

// Virtual relationship: Populate all Farmers belonging to this Village
villageSchema.virtual('farmers', {
  ref: 'Farmer',
  localField: '_id',
  foreignField: 'villageId',
});

// Virtual relationship: Populate all VLEs belonging to this Village
villageSchema.virtual('vles', {
  ref: 'VLE',
  localField: '_id',
  foreignField: 'villageId',
});

// Indexes for optimized searching and filtering
villageSchema.index({ name: 1, district: 1 });
villageSchema.index({ status: 1, createdAt: -1 });

const Village = mongoose.models.Village || mongoose.model('Village', villageSchema);

export default Village;

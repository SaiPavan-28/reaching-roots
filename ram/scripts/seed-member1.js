import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/reaching_roots';

// Inline minimal schemas for standalone execution
const VillageSchema = new mongoose.Schema({
  villageId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  district: String,
  panchayat: String,
  waterResources: String,
  acresUnderCultivation: Number,
  farmersCount: { type: Number, default: 0 },
  status: { type: String, default: 'ACTIVE' },
}, { timestamps: true });

const FarmerSchema = new mongoose.Schema({
  farmerId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  mobileNumber: { type: String, required: true, unique: true },
  villageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Village' },
  auth: {
    otp: { type: String, default: '123456' },
    isVerified: { type: Boolean, default: true },
    lastLoginAt: Date,
  },
  status: { type: String, default: 'ACTIVE' },
}, { timestamps: true });

const StaffSchema = new mongoose.Schema({
  staffId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'ADMIN' },
  status: { type: String, default: 'ACTIVE' },
}, { timestamps: true });

const Village = mongoose.models.Village || mongoose.model('Village', VillageSchema);
const Farmer = mongoose.models.Farmer || mongoose.model('Farmer', FarmerSchema);
const Staff = mongoose.models.Staff || mongoose.model('Staff', StaffSchema);

async function seed() {
  console.log('Connecting to MongoDB at:', MONGODB_URI);
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB successfully.');

    // 1. Seed Villages
    console.log('Seeding initial villages...');
    await Village.deleteMany({});

    const villagesData = [
      { villageId: 'VIL-001', name: 'Rampur', district: 'Central', waterResources: 'Canal Irrigation & Borewells', acresUnderCultivation: 340, farmersCount: 142 },
      { villageId: 'VIL-002', name: 'Shivpuri', district: 'North', waterResources: 'River Basin & Tanks', acresUnderCultivation: 210, farmersCount: 98 },
      { villageId: 'VIL-003', name: 'Belur', district: 'South', waterResources: 'Tube Wells', acresUnderCultivation: 290, farmersCount: 115 },
      { villageId: 'VIL-004', name: 'Krishnapur', district: 'East', waterResources: 'Lake & Submersible Pumps', acresUnderCultivation: 180, farmersCount: 84 },
      { villageId: 'VIL-005', name: 'Madhupur', district: 'West', waterResources: 'Groundwater Borewells', acresUnderCultivation: 160, farmersCount: 67 },
      { villageId: 'VIL-006', name: 'Dharamgarh', district: 'Central', waterResources: 'Canal System', acresUnderCultivation: 270, farmersCount: 103 },
    ];

    const insertedVillages = await Village.insertMany(villagesData);
    console.log(`Inserted ${insertedVillages.length} villages.`);

    // 2. Seed Staff Account
    console.log('Seeding initial Staff Administrator account...');
    await Staff.deleteMany({});
    const hashedPassword = await bcrypt.hash('password123', 10);

    const staffAccount = await Staff.create({
      staffId: 'STF-2041',
      fullName: 'Rajesh Kumar Verma',
      email: 'admin@agri.gov.in',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    });
    console.log('Staff seeded:', staffAccount.staffId, `(${staffAccount.email})`);

    // 3. Seed Initial Farmer
    console.log('Seeding initial Farmer test record...');
    await Farmer.deleteMany({});
    const initialFarmer = await Farmer.create({
      farmerId: 'FARM-0001',
      fullName: 'Ramesh Patel',
      mobileNumber: '9876543210',
      villageId: insertedVillages[0]._id,
      auth: {
        otp: '123456',
        isVerified: true,
        lastLoginAt: new Date(),
      },
      status: 'ACTIVE',
    });
    console.log('Farmer seeded:', initialFarmer.farmerId, `(+91 ${initialFarmer.mobileNumber})`);

    console.log('\n--- Member 1 Database Seeding Completed Successfully! ---');
    console.log('Test Credentials:');
    console.log('  Farmer: Mobile 9876543210 (OTP: 123456)');
    console.log('  Staff:  STF-2041 or admin@agri.gov.in (Password: password123)');
  } catch (error) {
    console.error('Seeding error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seed();

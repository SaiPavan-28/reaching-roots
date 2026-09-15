import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import VLE from '@/models/VLE';
import Village from '@/models/Village';
import mongoose from 'mongoose';

export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const {
      name,
      fullName,
      mobile,
      mobileNumber,
      village,
      villageId,
      password,
      centerName,
    } = body;

    const vFullName = (fullName || name || '').trim();
    const vMobile = (mobileNumber || mobile || '').trim();
    const vVillage = villageId || village;
    const vPassword = (password || '').trim();
    const vCenterName = (centerName || '').trim();

    if (!vFullName || !vMobile || !vVillage || !vPassword) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide all required fields: name, mobile, village, and password',
        },
        { status: 400 }
      );
    }

    // Validate mobile number format
    if (!/^[6-9]\d{9}$/.test(vMobile)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide a valid 10-digit Indian mobile number',
        },
        { status: 400 }
      );
    }

    // Check if VLE with this mobile already exists
    const existingVLE = await VLE.findOne({ mobileNumber: vMobile });
    if (existingVLE) {
      return NextResponse.json(
        {
          success: false,
          error: 'A VLE account with this mobile number already exists',
        },
        { status: 409 }
      );
    }

    // Resolve Village reference (by ObjectId, villageId, or name)
    let resolvedVillage = null;
    if (mongoose.Types.ObjectId.isValid(vVillage)) {
      resolvedVillage = await Village.findById(vVillage);
    }
    if (!resolvedVillage) {
      resolvedVillage = await Village.findOne({
        $or: [{ villageId: vVillage }, { name: new RegExp(`^${vVillage}$`, 'i') }],
      });
    }

    if (!resolvedVillage) {
      return NextResponse.json(
        {
          success: false,
          error: 'Referenced village could not be found. Please select a valid village.',
        },
        { status: 404 }
      );
    }

    // Create new VLE
    const newVLE = new VLE({
      vleId: `VLE-${Date.now()}`,
      fullName: vFullName,
      mobileNumber: vMobile,
      villageId: resolvedVillage._id,
      centerName: vCenterName || `${vFullName}'s Agro Center`,
      password: vPassword,
      auth: {
        password: vPassword,
        isVerified: true,
      },
      status: 'ACTIVE',
    });

    await newVLE.save();

    const vleResponse = newVLE.toObject();
    delete vleResponse.password;
    if (vleResponse.auth) {
      delete vleResponse.auth.password;
      delete vleResponse.auth.otp;
    }

    return NextResponse.json(
      {
        success: true,
        message: 'VLE registered successfully',
        data: vleResponse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error during VLE signup:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error during VLE signup',
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Request from '@/models/Request';
import Farmer from '@/models/Farmer';
import VLE from '@/models/VLE';
import Machinery from '@/models/Machinery';
import mongoose from 'mongoose';

/**
 * GET /api/requests
 * Fetch requests with optional filters (farmerId, vleId, status).
 */
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const farmerParam = searchParams.get('farmerId');
    const vleParam = searchParams.get('vleId');
    const status = searchParams.get('status');

    const query = {};

    if (status) {
      query.status = status.toUpperCase();
    }

    if (farmerParam) {
      if (mongoose.Types.ObjectId.isValid(farmerParam)) {
        query.farmerId = farmerParam;
      } else {
        const foundFarmer = await Farmer.findOne({ farmerId: farmerParam });
        if (foundFarmer) query.farmerId = foundFarmer._id;
        else return NextResponse.json({ success: true, count: 0, data: [] });
      }
    }

    if (vleParam) {
      if (mongoose.Types.ObjectId.isValid(vleParam)) {
        query.vleId = vleParam;
      } else {
        const foundVLE = await VLE.findOne({ vleId: vleParam });
        if (foundVLE) query.vleId = foundVLE._id;
        else return NextResponse.json({ success: true, count: 0, data: [] });
      }
    }

    const requests = await Request.find(query)
      .populate('farmerId', 'farmerId fullName mobileNumber villageId')
      .populate('vleId', 'vleId fullName mobileNumber centerName villageId')
      .populate('machineryId', 'machineryId name category rateDescription availableUnits totalUnits status')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error fetching requests' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/requests
 * Farmer submits an equipment/machinery request to a VLE.
 */
export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const {
      farmerId,
      vleId,
      machineryId,
      requiredDate,
      requestedDate,
      quantityOrArea,
      additionalNote,
      notes,
    } = body;

    const reqDate = requiredDate || requestedDate;
    const notesText = additionalNote || notes || '';

    if (!farmerId || !vleId || !machineryId || !reqDate || !quantityOrArea) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide all required fields: farmerId, vleId, machineryId, requiredDate, and quantityOrArea',
        },
        { status: 400 }
      );
    }

    // Resolve Farmer
    let resolvedFarmer = null;
    if (mongoose.Types.ObjectId.isValid(farmerId)) {
      resolvedFarmer = await Farmer.findById(farmerId);
    }
    if (!resolvedFarmer) {
      resolvedFarmer = await Farmer.findOne({ farmerId: farmerId });
    }
    if (!resolvedFarmer) {
      return NextResponse.json(
        { success: false, error: 'Farmer not found' },
        { status: 404 }
      );
    }

    // Resolve VLE
    let resolvedVLE = null;
    if (mongoose.Types.ObjectId.isValid(vleId)) {
      resolvedVLE = await VLE.findById(vleId);
    }
    if (!resolvedVLE) {
      resolvedVLE = await VLE.findOne({ vleId: vleId });
    }
    if (!resolvedVLE) {
      return NextResponse.json(
        { success: false, error: 'VLE not found' },
        { status: 404 }
      );
    }

    // Resolve Machinery
    let resolvedMachinery = null;
    if (mongoose.Types.ObjectId.isValid(machineryId)) {
      resolvedMachinery = await Machinery.findById(machineryId);
    }
    if (!resolvedMachinery) {
      resolvedMachinery = await Machinery.findOne({ machineryId: machineryId });
    }
    if (!resolvedMachinery) {
      return NextResponse.json(
        { success: false, error: 'Machinery not found' },
        { status: 404 }
      );
    }

    // Verify machinery belongs to the VLE
    if (resolvedMachinery.vleId.toString() !== resolvedVLE._id.toString()) {
      return NextResponse.json(
        {
          success: false,
          error: 'The requested machinery does not belong to the selected VLE',
        },
        { status: 400 }
      );
    }

    const parsedDate = new Date(reqDate);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid required date format' },
        { status: 400 }
      );
    }

    // Create Request
    const newRequest = new Request({
      requestId: `REQ-${Date.now()}`,
      farmerId: resolvedFarmer._id,
      vleId: resolvedVLE._id,
      machineryId: resolvedMachinery._id,
      requiredDate: parsedDate,
      quantityOrArea: String(quantityOrArea).trim(),
      additionalNote: String(notesText).trim(),
      status: 'PENDING',
    });

    await newRequest.save();

    const populated = await Request.findById(newRequest._id)
      .populate('farmerId', 'farmerId fullName mobileNumber villageId')
      .populate('vleId', 'vleId fullName mobileNumber centerName villageId')
      .populate('machineryId', 'machineryId name category rateDescription availableUnits totalUnits status');

    return NextResponse.json(
      {
        success: true,
        message: 'Machinery request submitted successfully',
        data: populated,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting machinery request:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error submitting machinery request' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Machinery from '@/models/Machinery';
import mongoose from 'mongoose';

/**
 * GET /api/machinery/[id]
 * Fetch single machinery item by MongoDB _id or custom machineryId.
 */
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ _id: id }, { machineryId: id }] };
    } else {
      query = { machineryId: id };
    }

    const machinery = await Machinery.findOne(query).populate({
      path: 'vleId',
      select: 'vleId fullName mobileNumber centerName villageId',
      populate: {
        path: 'villageId',
        select: 'villageId name district panchayat',
      },
    });

    if (!machinery) {
      return NextResponse.json(
        { success: false, error: 'Machinery not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: machinery });
  } catch (error) {
    console.error('Error fetching machinery details:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error fetching machinery details' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/machinery/[id]
 * Update machinery units, pricing (rateDescription), or status (e.g. MAINTENANCE, AVAILABLE).
 */
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ _id: id }, { machineryId: id }] };
    } else {
      query = { machineryId: id };
    }

    const machinery = await Machinery.findOne(query);
    if (!machinery) {
      return NextResponse.json(
        { success: false, error: 'Machinery not found' },
        { status: 404 }
      );
    }

    const {
      name,
      category,
      totalUnits,
      availableUnits,
      totalQuantity,
      availableQuantity,
      rateDescription,
      status,
    } = body;

    if (name !== undefined) machinery.name = name.trim();
    if (category !== undefined) machinery.category = category.trim();
    if (rateDescription !== undefined) machinery.rateDescription = rateDescription.trim();

    const tUnits = totalUnits !== undefined ? Number(totalUnits) : (totalQuantity !== undefined ? Number(totalQuantity) : machinery.totalUnits);
    const aUnits = availableUnits !== undefined ? Number(availableUnits) : (availableQuantity !== undefined ? Number(availableQuantity) : machinery.availableUnits);

    if (isNaN(tUnits) || tUnits < 0) {
      return NextResponse.json(
        { success: false, error: 'Total units must be a non-negative number' },
        { status: 400 }
      );
    }

    if (isNaN(aUnits) || aUnits < 0 || aUnits > tUnits) {
      return NextResponse.json(
        { success: false, error: `Available units must be between 0 and total units (${tUnits})` },
        { status: 400 }
      );
    }

    machinery.totalUnits = tUnits;
    machinery.availableUnits = aUnits;
    machinery.totalQuantity = tUnits;
    machinery.availableQuantity = aUnits;

    if (status !== undefined) {
      machinery.status = status;
    } else if (aUnits === 0 && machinery.status === 'AVAILABLE') {
      machinery.status = 'OUT_OF_STOCK';
    } else if (aUnits > 0 && machinery.status === 'OUT_OF_STOCK') {
      machinery.status = 'AVAILABLE';
    }

    await machinery.save();

    const updated = await Machinery.findById(machinery._id).populate({
      path: 'vleId',
      select: 'vleId fullName mobileNumber centerName villageId',
    });

    return NextResponse.json({
      success: true,
      message: 'Machinery updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating machinery:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error updating machinery' },
      { status: 500 }
    );
  }
}

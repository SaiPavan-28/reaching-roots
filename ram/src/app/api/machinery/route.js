import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Machinery from '@/models/Machinery';
import VLE from '@/models/VLE';
import Village from '@/models/Village';
import mongoose from 'mongoose';

/**
 * GET /api/machinery
 * Fetches machinery catalog. Supports filtering by villageId, vleId, category, and status.
 */
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const villageParam = searchParams.get('villageId') || searchParams.get('village');
    const vleParam = searchParams.get('vleId');
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    const query = {};

    if (category) {
      query.category = new RegExp(`^${category}$`, 'i');
    }

    if (status) {
      query.status = status.toUpperCase();
    }

    // Filter by VLE directly
    if (vleParam) {
      if (mongoose.Types.ObjectId.isValid(vleParam)) {
        query.vleId = vleParam;
      } else {
        const foundVLE = await VLE.findOne({ vleId: vleParam });
        if (foundVLE) {
          query.vleId = foundVLE._id;
        } else {
          return NextResponse.json({ success: true, count: 0, data: [] });
        }
      }
    }
    // Filter by Village (finds all VLEs belonging to the village first)
    else if (villageParam) {
      let resolvedVillageId = null;
      if (mongoose.Types.ObjectId.isValid(villageParam)) {
        resolvedVillageId = villageParam;
      } else {
        const foundVillage = await Village.findOne({
          $or: [{ villageId: villageParam }, { name: new RegExp(`^${villageParam}$`, 'i') }],
        });
        if (foundVillage) {
          resolvedVillageId = foundVillage._id;
        }
      }

      if (!resolvedVillageId) {
        return NextResponse.json({ success: true, count: 0, data: [] });
      }

      const vlesInVillage = await VLE.find({ villageId: resolvedVillageId }).select('_id');
      const vleIds = vlesInVillage.map((v) => v._id);
      query.vleId = { $in: vleIds };
    }

    const machineryList = await Machinery.find(query)
      .populate({
        path: 'vleId',
        select: 'vleId fullName mobileNumber centerName villageId',
        populate: {
          path: 'villageId',
          select: 'villageId name district panchayat',
        },
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: machineryList.length,
      data: machineryList,
    });
  } catch (error) {
    console.error('Error fetching machinery catalog:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error fetching machinery catalog' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/machinery
 * Adds a new machinery/stock item for a VLE.
 */
export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const {
      name,
      category,
      vleId,
      totalUnits,
      availableUnits,
      totalQuantity,
      availableQuantity,
      rateDescription,
    } = body;

    if (!name || !vleId) {
      return NextResponse.json(
        { success: false, error: 'Name and VLE ID are required' },
        { status: 400 }
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
        { success: false, error: 'Referenced VLE could not be found' },
        { status: 404 }
      );
    }

    const tUnits = Number(totalUnits !== undefined ? totalUnits : (totalQuantity !== undefined ? totalQuantity : 1));
    const aUnits = Number(availableUnits !== undefined ? availableUnits : (availableQuantity !== undefined ? availableQuantity : tUnits));

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

    const newMachinery = new Machinery({
      machineryId: `MACH-${Date.now()}`,
      name: name.trim(),
      category: category ? category.trim() : 'Other',
      vleId: resolvedVLE._id,
      totalUnits: tUnits,
      availableUnits: aUnits,
      totalQuantity: tUnits,
      availableQuantity: aUnits,
      rateDescription: (rateDescription || '').trim(),
      status: aUnits > 0 ? 'AVAILABLE' : 'OUT_OF_STOCK',
    });

    await newMachinery.save();

    const populatedMachinery = await Machinery.findById(newMachinery._id).populate({
      path: 'vleId',
      select: 'vleId fullName mobileNumber centerName villageId',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Machinery stock added successfully',
        data: populatedMachinery,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding machinery stock:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error adding machinery stock' },
      { status: 500 }
    );
  }
}

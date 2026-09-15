import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Request from '@/models/Request';
import VLE from '@/models/VLE';
import mongoose from 'mongoose';

/**
 * GET /api/requests/vle/[vleId]
 * Fetch all incoming, pending, and historical requests for a specific VLE queue.
 */
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { vleId } = await params;
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');

    let resolvedVLEId = null;
    if (mongoose.Types.ObjectId.isValid(vleId)) {
      resolvedVLEId = vleId;
    } else {
      const foundVLE = await VLE.findOne({ vleId: vleId });
      if (foundVLE) resolvedVLEId = foundVLE._id;
    }

    if (!resolvedVLEId) {
      return NextResponse.json(
        { success: false, error: 'VLE not found' },
        { status: 404 }
      );
    }

    const query = { vleId: resolvedVLEId };
    if (statusParam) {
      query.status = statusParam.toUpperCase();
    }

    const requests = await Request.find(query)
      .populate({
        path: 'farmerId',
        select: 'farmerId fullName mobileNumber villageId',
        populate: {
          path: 'villageId',
          select: 'villageId name district',
        },
      })
      .populate('machineryId', 'machineryId name category rateDescription availableUnits totalUnits status')
      .sort({ createdAt: -1 });

    const pendingCount = requests.filter((r) => r.status === 'PENDING').length;
    const acceptedCount = requests.filter((r) => r.status === 'ACCEPTED').length;
    const completedCount = requests.filter((r) => r.status === 'COMPLETED').length;
    const rejectedCount = requests.filter((r) => r.status === 'REJECTED').length;

    return NextResponse.json({
      success: true,
      count: requests.length,
      summary: {
        total: requests.length,
        pending: pendingCount,
        accepted: acceptedCount,
        completed: completedCount,
        rejected: rejectedCount,
      },
      data: requests,
    });
  } catch (error) {
    console.error('Error fetching VLE request queue:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error fetching VLE request queue' },
      { status: 500 }
    );
  }
}

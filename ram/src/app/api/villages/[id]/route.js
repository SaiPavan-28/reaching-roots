import dbConnect from '@/lib/dbConnect';
import Village from '@/models/Village';
import Farmer from '@/models/Farmer';
import { successResponse, errorResponse } from '@/lib/apiResponse';

/**
 * GET /api/villages/[id]
 * Fetch single village by ID with associated farmers.
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    let village = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      village = await Village.findById(id).lean();
    } else {
      village = await Village.findOne({ villageId: id.toUpperCase() }).lean();
    }

    if (!village) {
      return errorResponse('Village not found', 404);
    }

    // Populate registered farmers
    const farmers = await Farmer.find({ villageId: village._id })
      .select('farmerId fullName mobileNumber status createdAt')
      .lean();

    return successResponse({
      ...village,
      farmers,
    }, 200);
  } catch (error) {
    console.error('Error fetching village details:', error);
    return errorResponse(error.message || 'Failed to fetch village details', 500);
  }
}

/**
 * PUT /api/villages/[id]
 * Update village information.
 */
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const updates = await request.json();

    await dbConnect();

    const village = await Village.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!village) {
      return errorResponse('Village not found', 404);
    }

    return successResponse(village, 200, 'Village updated successfully');
  } catch (error) {
    console.error('Error updating village:', error);
    return errorResponse(error.message || 'Failed to update village', 500);
  }
}

/**
 * DELETE /api/villages/[id]
 * Soft delete/deactivate village.
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    const village = await Village.findByIdAndUpdate(
      id,
      { $set: { status: 'INACTIVE' } },
      { new: true }
    );

    if (!village) {
      return errorResponse('Village not found', 404);
    }

    return successResponse(village, 200, 'Village deactivated successfully');
  } catch (error) {
    console.error('Error deactivating village:', error);
    return errorResponse(error.message || 'Failed to deactivate village', 500);
  }
}

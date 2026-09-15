import dbConnect from '@/lib/dbConnect';
import Village from '@/models/Village';
import { successResponse, errorResponse } from '@/lib/apiResponse';

/**
 * GET /api/villages
 * List all registered active villages with optional search query.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const district = searchParams.get('district') || '';

    let query = { status: 'ACTIVE' };
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (district) {
      query.district = { $regex: district, $options: 'i' };
    }

    try {
      await dbConnect();

      const villages = await Village.find(query)
        .select('villageId name district panchayat waterResources acresUnderCultivation farmersCount status')
        .sort({ name: 1 })
        .lean();

      if (villages && villages.length > 0) {
        return successResponse(villages, 200);
      }
    } catch (dbErr) {
      console.warn('DB connect deferred in GET /api/villages:', dbErr.message);
    }

    // Default static village list for prototype resilience
    const defaultVillages = [
      { id: 'vil-1', villageId: 'VIL-001', name: 'Rampur', district: 'Central', farmersCount: 142 },
      { id: 'vil-2', villageId: 'VIL-002', name: 'Shivpuri', district: 'North', farmersCount: 98 },
      { id: 'vil-3', villageId: 'VIL-003', name: 'Belur', district: 'South', farmersCount: 115 },
      { id: 'vil-4', villageId: 'VIL-004', name: 'Krishnapur', district: 'East', farmersCount: 84 },
      { id: 'vil-5', villageId: 'VIL-005', name: 'Madhupur', district: 'West', farmersCount: 67 },
      { id: 'vil-6', villageId: 'VIL-006', name: 'Dharamgarh', district: 'Central', farmersCount: 103 },
    ];

    return successResponse(defaultVillages, 200);
  } catch (error) {
    console.error('Error in GET /api/villages:', error);
    return errorResponse(error.message || 'Failed to fetch villages', 500);
  }
}

/**
 * POST /api/villages
 * Add a new Village record (Staff feature).
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, district, panchayat, waterResources, acresUnderCultivation } = body;

    if (!name) {
      return errorResponse('Village name is required', 400);
    }

    await dbConnect();

    const count = await Village.countDocuments();
    const villageId = `VIL-${String(count + 1).padStart(3, '0')}`;

    const newVillage = await Village.create({
      villageId,
      name: name.trim(),
      district: district?.trim() || 'Unassigned District',
      panchayat: panchayat?.trim() || '',
      waterResources: waterResources?.trim() || 'Canal & Ground Water',
      acresUnderCultivation: Number(acresUnderCultivation) || 0,
      farmersCount: 0,
      status: 'ACTIVE',
    });

    return successResponse(newVillage, 201, 'Village registered successfully');
  } catch (error) {
    console.error('Error in POST /api/villages:', error);
    return errorResponse(error.message || 'Failed to create village', 500);
  }
}

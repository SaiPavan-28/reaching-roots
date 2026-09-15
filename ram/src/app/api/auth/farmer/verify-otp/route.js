import dbConnect from '@/lib/dbConnect';
import Farmer from '@/models/Farmer';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { signToken } from '@/lib/auth';

/**
 * POST /api/auth/farmer/verify-otp
 * Verify static OTP (123456) and return authenticated Farmer session & JWT.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { mobileNumber, otp } = body;

    if (!mobileNumber || !otp) {
      return errorResponse('Mobile number and OTP are required', 400);
    }

    const cleanMobile = String(mobileNumber).replace(/\D/g, '');
    const cleanOtp = String(otp).trim();

    // Enforce static prototype OTP requirement
    if (cleanOtp !== '123456') {
      return errorResponse('Invalid OTP. Please enter prototype code: 123456', 401);
    }

    let farmerData = {
      role: 'farmer',
      mobileNumber: cleanMobile,
      fullName: 'Kisan Mitra',
      isVerified: true,
    };

    try {
      await dbConnect();

      let farmer = await Farmer.findOne({ mobileNumber: cleanMobile }).populate('villageId');
      if (farmer) {
        farmer.auth = farmer.auth || {};
        farmer.auth.isVerified = true;
        farmer.auth.lastLoginAt = new Date();
        await farmer.save();

        farmerData = {
          id: farmer._id,
          farmerId: farmer.farmerId,
          role: 'farmer',
          fullName: farmer.fullName,
          mobileNumber: farmer.mobileNumber,
          village: farmer.villageId?.name || 'Assigned Village',
          villageId: farmer.villageId?._id,
          isVerified: true,
        };
      } else {
        // Unregistered mobile number attempting login; return session with prompt to signup
        farmerData = {
          role: 'farmer',
          mobileNumber: cleanMobile,
          fullName: `Farmer (${cleanMobile.slice(-4)})`,
          isVerified: true,
          isNewAccount: true,
        };
      }
    } catch (dbErr) {
      console.warn('DB connect deferred in verify-otp:', dbErr.message);
    }

    // Generate JWT token for farmer session
    const token = signToken({
      role: 'farmer',
      mobileNumber: cleanMobile,
      farmerId: farmerData.farmerId || `FARM-${cleanMobile.slice(-4)}`,
      id: farmerData.id,
    });

    return successResponse(
      {
        token,
        user: farmerData,
      },
      200,
      'Farmer verified and authenticated successfully'
    );
  } catch (error) {
    console.error('Error in verify-otp route:', error);
    return errorResponse(error.message || 'Verification failed', 500);
  }
}

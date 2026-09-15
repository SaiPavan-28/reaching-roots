import dbConnect from '@/lib/dbConnect';
import Farmer from '@/models/Farmer';
import { successResponse, errorResponse } from '@/lib/apiResponse';

/**
 * POST /api/auth/farmer/send-otp
 * Request OTP for Farmer authentication.
 * Static prototype OTP: '123456'
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { mobileNumber } = body;

    if (!mobileNumber) {
      return errorResponse('Mobile number is required', 400);
    }

    const cleanMobile = String(mobileNumber).replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      return errorResponse('Please provide a valid 10-digit mobile number', 400);
    }

    const PROTOTYPE_OTP = '123456';
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    try {
      await dbConnect();

      // Check if farmer exists, or update OTP
      const existingFarmer = await Farmer.findOne({ mobileNumber: cleanMobile });
      if (existingFarmer) {
        existingFarmer.auth = existingFarmer.auth || {};
        existingFarmer.auth.otp = PROTOTYPE_OTP;
        existingFarmer.auth.otpExpiresAt = otpExpiresAt;
        await existingFarmer.save();
      }
    } catch (dbErr) {
      console.warn('DB connect/query deferred in send-otp:', dbErr.message);
    }

    return successResponse(
      {
        mobileNumber: cleanMobile,
        message: `OTP sent successfully to +91 ${cleanMobile}`,
        otpHint: PROTOTYPE_OTP,
        expiresInSeconds: 600,
      },
      200,
      'OTP sent successfully'
    );
  } catch (error) {
    console.error('Error in send-otp route:', error);
    return errorResponse(error.message || 'Failed to send OTP', 500);
  }
}

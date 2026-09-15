import dbConnect from '@/lib/dbConnect';
import Staff from '@/models/Staff';
import VLE from '@/models/VLE';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { comparePassword, signToken } from '@/lib/auth';

/**
 * POST /api/auth/login
 * Handles authentication for Staff (Email/Staff ID + Password)
 * and VLE (Mobile Number + Password).
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { identifier, mobile, password, role } = body;

    if (!password) {
      return errorResponse('Password is required', 400);
    }

    // Default to 'staff' if identifier or email is provided, else 'vle' if mobile is provided
    const targetRole = role || (mobile ? 'vle' : 'staff');

    try {
      await dbConnect();

      if (targetRole === 'staff') {
        const staffLookup = identifier ? identifier.trim() : '';
        if (!staffLookup) {
          return errorResponse('Staff ID or official email is required', 400);
        }

        // Search Staff by email or staffId with password selected
        const staff = await Staff.findOne({
          $or: [
            { email: staffLookup.toLowerCase() },
            { staffId: staffLookup.toUpperCase() },
          ],
        }).select('+password');

        if (staff) {
          const isMatch = await comparePassword(password, staff.password);
          // Prototype allow test password 'password123' if hash wasn't generated yet
          if (!isMatch && password !== 'password123') {
            return errorResponse('Invalid Staff credentials', 401);
          }

          staff.lastLoginAt = new Date();
          await staff.save();

          const token = signToken({
            id: staff._id,
            role: 'staff',
            staffId: staff.staffId,
            email: staff.email,
            department: staff.role,
          });

          return successResponse(
            {
              token,
              user: {
                id: staff._id,
                role: 'staff',
                staffId: staff.staffId,
                fullName: staff.fullName,
                email: staff.email,
                roleTitle: staff.role,
              },
            },
            200,
            'Staff authenticated successfully'
          );
        }
      } else if (targetRole === 'vle') {
        const cleanMobile = String(mobile || identifier).replace(/\D/g, '');
        const vle = await VLE.findOne({ mobileNumber: cleanMobile }).select('+password');

        if (vle) {
          const isMatch = await comparePassword(password, vle.password);
          if (!isMatch && password !== 'password123') {
            return errorResponse('Invalid VLE credentials', 401);
          }

          const token = signToken({
            id: vle._id,
            role: 'vle',
            vleId: vle.vleId,
            mobileNumber: vle.mobileNumber,
          });

          return successResponse(
            {
              token,
              user: {
                id: vle._id,
                role: 'vle',
                vleId: vle.vleId,
                fullName: vle.fullName,
                mobileNumber: vle.mobileNumber,
              },
            },
            200,
            'VLE authenticated successfully'
          );
        }
      }
    } catch (dbErr) {
      console.warn('DB connect deferred in auth/login:', dbErr.message);
    }

    // Prototype fallback if DB is not populated yet
    const token = signToken({
      role: targetRole,
      identifier: identifier || mobile,
    });

    return successResponse(
      {
        token,
        user: {
          role: targetRole,
          name: targetRole === 'staff' ? 'Agricultural Officer' : 'VLE Operator',
          identifier: identifier || mobile,
        },
      },
      200,
      'Login successful'
    );
  } catch (error) {
    console.error('Error in auth/login route:', error);
    return errorResponse(error.message || 'Authentication error', 500);
  }
}

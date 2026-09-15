import { successResponse, errorResponse } from '@/lib/apiResponse';
import { getAuthUser } from '@/lib/auth';

/**
 * GET /api/auth/me
 * Returns current authenticated user profile from JWT header.
 */
export async function GET(request) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return errorResponse('Unauthorized or token expired', 401);
    }

    return successResponse(
      {
        user,
      },
      200,
      'User session active'
    );
  } catch (error) {
    return errorResponse(error.message || 'Failed to authenticate user', 500);
  }
}

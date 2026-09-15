import { NextResponse } from 'next/server';

/**
 * Standard API Success Response
 */
export function successResponse(data, status = 200, message = null) {
  const body = {
    success: true,
    data,
  };
  if (message) {
    body.message = message;
  }
  return NextResponse.json(body, { status });
}

/**
 * Standard API Error Response
 */
export function errorResponse(message, status = 400, details = null) {
  const body = {
    success: false,
    error: message,
  };
  if (details) {
    body.details = details;
  }
  return NextResponse.json(body, { status });
}

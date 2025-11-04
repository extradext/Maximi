import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export function successResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data });
}

export function errorResponse(error: string, status: number = 400): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error }, { status });
}

export function validateRequired(body: any, fields: string[]): string | null {
  for (const field of fields) {
    if (!body[field]) {
      return `Missing required field: ${field}`;
    }
  }
  return null;
}
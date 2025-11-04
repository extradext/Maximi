import { NextRequest } from 'next/server';
import { successResponse, errorResponse, validateRequired } from '@/lib/api';
import prisma from '@/lib/prisma';

/**
 * POST /api/session/save
 * Save or update a session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, sessionId, name, mode, data, expiresAt } = body;

    const validationError = validateRequired(body, ['userId', 'data']);
    if (validationError) {
      return errorResponse(validationError, 400);
    }

    if (sessionId) {
      // Update existing session
      const session = await prisma.sessionState.update({
        where: { id: sessionId },
        data: {
          name: name || undefined,
          mode: mode || undefined,
          data,
          expiresAt: expiresAt ? new Date(expiresAt) : undefined,
          updatedAt: new Date(),
        },
      });
      return successResponse({ session });
    } else {
      // Create new session
      const session = await prisma.sessionState.create({
        data: {
          userId,
          name: name || 'Untitled Session',
          mode: mode || 'exploration',
          data,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
        },
      });
      return successResponse({ session });
    }
  } catch (error: any) {
    console.error('Save session error:', error);
    return errorResponse(error.message || 'Failed to save session', 500);
  }
}

/**
 * GET /api/session?userId=xxx
 * Get all sessions for a user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return errorResponse('UserId is required', 400);
    }

    const sessions = await prisma.sessionState.findMany({
      where: { userId, isArchived: false },
      orderBy: { updatedAt: 'desc' },
    });

    return successResponse({ sessions });
  } catch (error: any) {
    console.error('Get sessions error:', error);
    return errorResponse(error.message || 'Failed to get sessions', 500);
  }
}

export const dynamic = 'force-dynamic';
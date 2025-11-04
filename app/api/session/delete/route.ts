import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api';
import prisma from '@/lib/prisma';

/**
 * DELETE /api/session/delete?sessionId=xxx
 * Delete a session
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return errorResponse('SessionId is required', 400);
    }

    await prisma.sessionState.delete({
      where: { id: sessionId },
    });

    return successResponse({ message: 'Session deleted successfully' });
  } catch (error: any) {
    console.error('Delete session error:', error);
    return errorResponse(error.message || 'Failed to delete session', 500);
  }
}

export const dynamic = 'force-dynamic';
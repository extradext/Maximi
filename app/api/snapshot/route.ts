import { NextRequest } from 'next/server';
import { successResponse, errorResponse, validateRequired } from '@/lib/api';
import prisma from '@/lib/prisma';
import { randomBytes } from 'crypto';

/**
 * POST /api/snapshot
 * Create a snapshot (frozen, shareable version) of the current map
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, mode, data } = body;

    const validationError = validateRequired(body, ['userId', 'data']);
    if (validationError) {
      return errorResponse(validationError, 400);
    }

    // Generate unique share hash
    const shareHash = randomBytes(16).toString('hex');

    const snapshot = await prisma.sessionState.create({
      data: {
        userId,
        name: name || 'Untitled Snapshot',
        mode: mode || 'publishing',
        data,
        isPublic: true,
        shareHash,
      },
    });

    return successResponse({
      snapshot,
      shareUrl: `/share/${shareHash}`,
    });
  } catch (error: any) {
    console.error('Create snapshot error:', error);
    return errorResponse(error.message || 'Failed to create snapshot', 500);
  }
}

/**
 * GET /api/snapshot?hash=xxx
 * Get a snapshot by share hash
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hash = searchParams.get('hash');

    if (!hash) {
      return errorResponse('Share hash is required', 400);
    }

    const snapshot = await prisma.sessionState.findUnique({
      where: { shareHash: hash },
    });

    if (!snapshot) {
      return errorResponse('Snapshot not found', 404);
    }

    return successResponse({ snapshot });
  } catch (error: any) {
    console.error('Get snapshot error:', error);
    return errorResponse(error.message || 'Failed to get snapshot', 500);
  }
}

export const dynamic = 'force-dynamic';
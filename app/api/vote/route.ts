import { NextRequest } from 'next/server';
import { successResponse, errorResponse, validateRequired } from '@/lib/api';
import prisma from '@/lib/prisma';

/**
 * POST /api/vote
 * Vote on a node (thumbs up/down for credibility)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, nodeId, snapshotId, voteType } = body;

    const validationError = validateRequired(body, ['userId', 'nodeId', 'voteType']);
    if (validationError) {
      return errorResponse(validationError, 400);
    }

    if (!['thumbs_up', 'thumbs_down'].includes(voteType)) {
      return errorResponse('Invalid vote type', 400);
    }

    // Upsert vote
    const vote = await prisma.vote.upsert({
      where: {
        userId_nodeId_snapshotId: {
          userId,
          nodeId,
          snapshotId: snapshotId || '',
        },
      },
      update: { voteType },
      create: {
        userId,
        nodeId,
        snapshotId,
        voteType,
      },
    });

    // Get vote counts
    const votes = await getVoteCounts(nodeId, snapshotId);

    return successResponse({ vote, votes });
  } catch (error: any) {
    console.error('Vote error:', error);
    return errorResponse(error.message || 'Failed to record vote', 500);
  }
}

/**
 * GET /api/vote?nodeId=xxx&snapshotId=xxx
 * Get vote counts for a node
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nodeId = searchParams.get('nodeId');
    const snapshotId = searchParams.get('snapshotId');

    if (!nodeId) {
      return errorResponse('NodeId is required', 400);
    }

    const votes = await getVoteCounts(nodeId, snapshotId);

    return successResponse({ votes });
  } catch (error: any) {
    console.error('Get votes error:', error);
    return errorResponse(error.message || 'Failed to get votes', 500);
  }
}

async function getVoteCounts(nodeId: string, snapshotId?: string | null) {
  const where: any = { nodeId };
  if (snapshotId) {
    where.snapshotId = snapshotId;
  }

  const allVotes = await prisma.vote.findMany({ where });

  const up = allVotes.filter((v) => v.voteType === 'thumbs_up').length;
  const down = allVotes.filter((v) => v.voteType === 'thumbs_down').length;

  return { up, down, total: up + down };
}

export const dynamic = 'force-dynamic';
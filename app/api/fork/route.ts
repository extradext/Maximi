import { NextRequest } from 'next/server';
import { successResponse, errorResponse, validateRequired } from '@/lib/api';
import prisma from '@/lib/prisma';

/**
 * POST /api/fork
 * Fork a snapshot to create a new editable session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, snapshotId } = body;

    const validationError = validateRequired(body, ['userId', 'snapshotId']);
    if (validationError) {
      return errorResponse(validationError, 400);
    }

    // Get the original snapshot
    const snapshot = await prisma.sessionState.findUnique({
      where: { id: snapshotId },
    });

    if (!snapshot) {
      return errorResponse('Snapshot not found', 404);
    }

    // Create new session from snapshot (only pinned nodes)
    const forkedData = filterPinnedNodes(snapshot.data);

    const newSession = await prisma.sessionState.create({
      data: {
        userId,
        name: `Fork of ${snapshot.name}`,
        mode: 'exploration',
        data: forkedData,
        forkedFrom: snapshotId,
      },
    });

    return successResponse({ session: newSession });
  } catch (error: any) {
    console.error('Fork error:', error);
    return errorResponse(error.message || 'Failed to fork snapshot', 500);
  }
}

/**
 * Filter data to keep only pinned nodes
 */
function filterPinnedNodes(data: any): any {
  if (!data || !data.nodes) return data;

  const pinnedNodes = data.nodes.filter((node: any) => node.isPinned);
  const pinnedNodeIds = new Set(pinnedNodes.map((n: any) => n.id));

  const filteredConnections = data.connections?.filter(
    (conn: any) => pinnedNodeIds.has(conn.from) && pinnedNodeIds.has(conn.to)
  ) || [];

  return {
    ...data,
    nodes: pinnedNodes,
    connections: filteredConnections,
  };
}

export const dynamic = 'force-dynamic';
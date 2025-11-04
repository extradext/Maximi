import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api';
import { getAIConfig, generateWeightedQuery, type QueryContext } from '@/lib/aiRouter';

/**
 * POST /api/search/expand
 * Expand a node to reveal child topics
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nodeId, topic, context } = body;

    if (!nodeId || !topic) {
      return errorResponse('NodeId and topic are required', 400);
    }

    // Get AI configuration
    const aiConfig = getAIConfig('explorer');

    // Generate child nodes
    const nodes = await expandNode(nodeId, topic, context, aiConfig);

    return successResponse({ nodes });
  } catch (error: any) {
    console.error('Expand node error:', error);
    return errorResponse(error.message || 'Failed to expand node', 500);
  }
}

/**
 * Expand a node to generate child topics
 */
async function expandNode(
  nodeId: string,
  topic: string,
  context: QueryContext,
  aiConfig: any
): Promise<any[]> {
  // Generate query based on context
  const query = generateWeightedQuery(topic, {
    ...context,
    parentTopic: topic,
    depth: (context.depth || 0) + 1,
  });

  // Mock implementation - replace with actual AI call
  const mockSubTopics = [
    `${topic} - Aspect A`,
    `${topic} - Aspect B`,
    `${topic} - Aspect C`,
    `${topic} - Related Field`,
    `${topic} - Case Study`,
  ];

  // Get parent node position (would come from context in real implementation)
  const parentX = 400;
  const parentY = 300;

  const childNodes = mockSubTopics.map((childTopic, index) => {
    const angle = (index / mockSubTopics.length) * 2 * Math.PI;
    const radius = 120;

    return {
      id: crypto.randomUUID(),
      label: childTopic,
      x: parentX + Math.cos(angle) * radius,
      y: parentY + Math.sin(angle) * radius,
      parentId: nodeId,
      isPinned: false,
      isExpanded: false,
      children: [],
      data: {
        depth: (context.depth || 0) + 1,
      },
    };
  });

  return childNodes;
}

export const dynamic = 'force-dynamic';
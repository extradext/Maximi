import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api';
import { getAIConfig, generateWeightedQuery, type QueryContext } from '@/lib/aiRouter';
import type { Node } from '@/lib/store';

/**
 * POST /api/search/seed
 * Initialize a new search with a seed topic
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, context } = body;

    if (!topic) {
      return errorResponse('Topic is required', 400);
    }

    // Get AI configuration
    const aiConfig = getAIConfig('explorer');

    // Generate seed nodes using AI
    const nodes = await generateSeedNodes(topic, context, aiConfig);

    return successResponse({ nodes });
  } catch (error: any) {
    console.error('Seed search error:', error);
    return errorResponse(error.message || 'Failed to generate seed nodes', 500);
  }
}

/**
 * Generate initial seed nodes for a topic
 */
async function generateSeedNodes(
  topic: string,
  context: QueryContext,
  aiConfig: any
): Promise<any[]> {
  // For now, return mock data
  // TODO: Integrate with Emergent LLM when emergentintegrations is installed
  
  const query = generateWeightedQuery(topic, context);
  
  // Mock implementation - replace with actual AI call
  const mockTopics = [
    `${topic} Fundamentals`,
    `${topic} Advanced Concepts`,
    `${topic} Practical Applications`,
    `${topic} Historical Context`,
    `${topic} Future Trends`,
  ];

  const centerNode: Node = {
    id: crypto.randomUUID(),
    label: topic,
    x: 400,
    y: 300,
    isPinned: true,
    isExpanded: false,
    children: [],
  };

  const childNodes = mockTopics.map((childTopic, index) => {
    const angle = (index / mockTopics.length) * 2 * Math.PI;
    const radius = 150;
    
    return {
      id: crypto.randomUUID(),
      label: childTopic,
      x: 400 + Math.cos(angle) * radius,
      y: 300 + Math.sin(angle) * radius,
      parentId: centerNode.id,
      isPinned: false,
      isExpanded: false,
      children: [],
    };
  });

  centerNode.children = childNodes.map((n) => n.id);

  return [centerNode, ...childNodes];
}

export const dynamic = 'force-dynamic';
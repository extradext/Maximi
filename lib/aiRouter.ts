/**
 * AI Router - Handles model selection and routing based on user plan and lens type
 * Feature-flagged for future AI Lens Marketplace
 */

import { getEnvVariable } from './env';

export type AIProvider = 'openai' | 'anthropic' | 'gemini';
export type AILensType = 'explorer' | 'scholar' | 'creator' | 'tutor' | 'enterprise';

export interface AIConfig {
  provider: AIProvider;
  model: string;
  apiKey: string;
}

export interface QueryContext {
  sliders?: {
    commonRare: number;
    newAged: number;
    mainstreamNiche: number;
    popularUnseen: number;
  };
  mode?: string;
  parentTopic?: string;
  depth?: number;
}

/**
 * AI Lens definitions (dormant until ENABLE_AI_LENS_MARKETPLACE=true)
 */
const AI_LENSES: Record<AILensType, AIConfig> = {
  explorer: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    apiKey: '', // Will be populated from env
  },
  scholar: {
    provider: 'anthropic',
    model: 'claude-3-5-sonnet-20241022',
    apiKey: '',
  },
  creator: {
    provider: 'openai',
    model: 'gpt-4o',
    apiKey: '',
  },
  tutor: {
    provider: 'anthropic',
    model: 'claude-3-7-sonnet-20250219',
    apiKey: '',
  },
  enterprise: {
    provider: 'gemini',
    model: 'gemini-2.0-flash',
    apiKey: '',
  },
};

/**
 * Get AI configuration based on lens type and user plan
 */
export function getAIConfig(lensType: AILensType = 'explorer'): AIConfig {
  // Check if custom AI provider key is set
  const customKey = getEnvVariable('AI_PROVIDER_KEY');
  const customProvider = getEnvVariable('AI_PROVIDER') as AIProvider || 'openai';
  const customModel = getEnvVariable('AI_MODEL') || 'gpt-4o-mini';

  if (customKey) {
    return {
      provider: customProvider,
      model: customModel,
      apiKey: customKey,
    };
  }

  // Use Emergent LLM Key (universal key)
  const emergentKey = getEnvVariable('EMERGENT_LLM_KEY');

  // Check if AI Lens Marketplace is enabled
  const lensEnabled = getEnvVariable('ENABLE_AI_LENS_MARKETPLACE') === 'true';

  if (lensEnabled && AI_LENSES[lensType]) {
    return {
      ...AI_LENSES[lensType],
      apiKey: emergentKey,
    };
  }

  // Default to explorer lens with Emergent key
  return {
    provider: 'openai',
    model: 'gpt-4o-mini',
    apiKey: emergentKey,
  };
}

/**
 * Generate weighted query based on slider settings
 */
export function generateWeightedQuery(
  topic: string,
  context: QueryContext
): string {
  const { sliders, mode, parentTopic, depth = 0 } = context;

  if (!sliders) {
    return `Generate 5 related topics to: ${topic}`;
  }

  // Build weighted instructions based on sliders
  const weights: string[] = [];

  // Common (0) <-> Rare (100)
  if (sliders.commonRare < 40) {
    weights.push('Focus on well-known, commonly discussed aspects');
  } else if (sliders.commonRare > 60) {
    weights.push('Explore rare, unusual, or lesser-known connections');
  }

  // New (0) <-> Aged (100)
  if (sliders.newAged < 40) {
    weights.push('Emphasize recent developments and current trends');
  } else if (sliders.newAged > 60) {
    weights.push('Include historical context and foundational concepts');
  }

  // Mainstream (0) <-> Niche (100)
  if (sliders.mainstreamNiche < 40) {
    weights.push('Stay within mainstream perspectives and popular viewpoints');
  } else if (sliders.mainstreamNiche > 60) {
    weights.push('Venture into niche areas, specialized subfields, or edge cases');
  }

  // Popular (0) <-> Unseen (100)
  if (sliders.popularUnseen < 40) {
    weights.push('Suggest widely recognized and frequently discussed topics');
  } else if (sliders.popularUnseen > 60) {
    weights.push('Discover overlooked, underexplored, or surprising angles');
  }

  const weightInstructions = weights.length > 0 ? `\n\n${weights.join('. ')}.` : '';

  let prompt = `Generate exactly 5 related topics or concepts connected to: "${topic}"`;

  if (parentTopic) {
    prompt += ` (within the broader context of "${parentTopic}")`;
  }

  prompt += weightInstructions;

  prompt += `\n\nProvide only the 5 topic names, one per line, without numbers or explanations.`;

  return prompt;
}

/**
 * Add entropy to query for refresh/diversity
 */
export function addQueryEntropy(query: string, entropyLevel: number = 0.5): string {
  const entropyPhrases = [
    'Show me different perspectives on',
    'Give me alternative angles on',
    'What are less obvious aspects of',
    'Reveal unexpected connections to',
    'Discover hidden facets of',
  ];

  if (entropyLevel > 0.7 && Math.random() > 0.5) {
    const phrase = entropyPhrases[Math.floor(Math.random() * entropyPhrases.length)];
    return query.replace('Generate exactly 5 related topics', phrase);
  }

  return query;
}
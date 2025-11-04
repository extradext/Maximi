import { NextRequest } from 'next/server';
import { successResponse, errorResponse, validateRequired } from '@/lib/api';
import prisma from '@/lib/prisma';

/**
 * POST /api/theme
 * Save or update a theme preset
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, presetId, name, config } = body;

    const validationError = validateRequired(body, ['name', 'config']);
    if (validationError) {
      return errorResponse(validationError, 400);
    }

    if (presetId) {
      // Update existing preset
      const preset = await prisma.themePreset.update({
        where: { id: presetId },
        data: { name, config },
      });
      return successResponse({ preset });
    } else {
      // Create new preset
      const preset = await prisma.themePreset.create({
        data: {
          userId,
          name,
          config,
        },
      });
      return successResponse({ preset });
    }
  } catch (error: any) {
    console.error('Save theme error:', error);
    return errorResponse(error.message || 'Failed to save theme', 500);
  }
}

/**
 * GET /api/theme?userId=xxx
 * Get all theme presets for a user (and default presets)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const where: any = {
      OR: [
        { isDefault: true },
        userId ? { userId } : {},
      ],
    };

    const presets = await prisma.themePreset.findMany({
      where,
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    return successResponse({ presets });
  } catch (error: any) {
    console.error('Get themes error:', error);
    return errorResponse(error.message || 'Failed to get themes', 500);
  }
}

export const dynamic = 'force-dynamic';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default theme presets
  const presets = [
    {
      name: 'Minimal Light',
      isDefault: true,
      config: {
        nodeSize: 40,
        density: 40,
        animationSpeed: 80,
        colors: {
          primary: '#3b82f6',
          secondary: '#8b5cf6',
          background: '#ffffff',
          text: '#1f2937',
          accent: '#f59e0b',
        },
        font: 'Inter',
        lineThickness: 1,
        darkMode: false,
        enableHover: true,
        enablePulse: false,
      },
    },
    {
      name: 'Dark Exploration',
      isDefault: true,
      config: {
        nodeSize: 55,
        density: 60,
        animationSpeed: 60,
        colors: {
          primary: '#60a5fa',
          secondary: '#a78bfa',
          background: '#0f172a',
          text: '#f1f5f9',
          accent: '#fbbf24',
        },
        font: 'Inter',
        lineThickness: 2,
        darkMode: true,
        enableHover: true,
        enablePulse: true,
      },
    },
    {
      name: 'Dense Research',
      isDefault: true,
      config: {
        nodeSize: 35,
        density: 80,
        animationSpeed: 90,
        colors: {
          primary: '#2563eb',
          secondary: '#7c3aed',
          background: '#f9fafb',
          text: '#111827',
          accent: '#f97316',
        },
        font: 'Inter',
        lineThickness: 3,
        darkMode: false,
        enableHover: true,
        enablePulse: false,
      },
    },
  ];

  for (const preset of presets) {
    await prisma.themePreset.upsert({
      where: { name: preset.name },
      update: preset,
      create: preset,
    });
    console.log(`✓ Created theme preset: ${preset.name}`);
  }

  // Create default subscription plans (dormant)
  const plans = [
    {
      name: 'free',
      displayName: 'Free',
      price: 0,
      features: {
        modes: ['exploration'],
        sessions: 5,
        pins: 20,
        aiLens: ['explorer'],
      },
      isActive: true,
    },
    {
      name: 'pro',
      displayName: 'Pro',
      price: 9.99,
      features: {
        modes: ['exploration', 'curriculum', 'classroom'],
        sessions: -1, // unlimited
        pins: -1,
        aiLens: ['explorer', 'scholar', 'tutor'],
        themeEditor: true,
      },
      isActive: false, // Coming soon
    },
    {
      name: 'creator',
      displayName: 'Creator',
      price: 29.99,
      features: {
        modes: ['exploration', 'curriculum', 'classroom', 'publishing'],
        sessions: -1,
        pins: -1,
        aiLens: ['explorer', 'scholar', 'creator', 'tutor'],
        themeEditor: true,
        publishing: true,
        revenueShare: 0.85, // 85% to creator, 15% to platform
      },
      isActive: false, // Coming soon
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan,
    });
    console.log(`✓ Created plan: ${plan.displayName}`);
  }

  // Create AI model lenses (dormant)
  const lenses = [
    {
      name: 'explorer',
      displayName: 'Explorer',
      description: 'General-purpose exploration with fast responses',
      provider: 'openai',
      model: 'gpt-4o-mini',
      price: 0,
      planRequired: null,
      isActive: true,
    },
    {
      name: 'scholar',
      displayName: 'Scholar',
      description: 'Academic depth with citations and context',
      provider: 'anthropic',
      model: 'claude-3-7-sonnet-20250219',
      price: 5,
      planRequired: 'pro',
      isActive: false,
    },
    {
      name: 'creator',
      displayName: 'Creator',
      description: 'Multimodal content generation',
      provider: 'openai',
      model: 'gpt-4o',
      price: 0, // Credit-based
      planRequired: 'creator',
      isActive: false,
    },
    {
      name: 'tutor',
      displayName: 'Tutor',
      description: 'Pedagogical guidance and learning paths',
      provider: 'anthropic',
      model: 'claude-4-sonnet-20250514',
      price: 0,
      planRequired: 'pro',
      isActive: false,
    },
    {
      name: 'enterprise',
      displayName: 'Enterprise',
      description: 'Self-hosted private models',
      provider: 'gemini',
      model: 'gemini-2.5-pro',
      price: 0, // Contract-based
      planRequired: 'enterprise',
      isActive: false,
    },
  ];

  for (const lens of lenses) {
    await prisma.aIModelLens.upsert({
      where: { name: lens.name },
      update: lens,
      create: lens,
    });
    console.log(`✓ Created AI lens: ${lens.displayName}`);
  }

  console.log('\n✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
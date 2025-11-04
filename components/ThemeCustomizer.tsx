'use client';

import { useState } from 'react';
import useMapStore, { type ThemeConfig } from '@/lib/store';
import { motion } from 'framer-motion';

interface ThemeCustomizerProps {
  onClose: () => void;
}

export default function ThemeCustomizer({ onClose }: ThemeCustomizerProps) {
  const theme = useMapStore((state) => state.theme);
  const updateTheme = useMapStore((state) => state.updateTheme);
  const loadThemePreset = useMapStore((state) => state.loadThemePreset);

  const presets: { name: string; theme: ThemeConfig }[] = [
    {
      name: 'Minimal Light',
      theme: {
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
      theme: {
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
      theme: {
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

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="w-96 h-screen bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-700 overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Theme Customizer</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
          aria-label="Close theme customizer"
        >
          ×
        </button>
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* Presets */}
        <section>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Presets</h3>
          <div className="space-y-2">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => loadThemePreset(preset.theme)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-left transition-colors border border-gray-200 dark:border-gray-700"
                data-testid={`theme-preset-${preset.name.toLowerCase().replace(' ', '-')}`}
              >
                <div className="font-medium text-gray-900 dark:text-white">{preset.name}</div>
                <div className="flex gap-2 mt-2">
                  {Object.values(preset.theme.colors).slice(0, 3).map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Node Size */}
        <section>
          <label className="block font-semibold text-gray-900 dark:text-white mb-2">
            Node Size: {theme.nodeSize}
          </label>
          <input
            type="range"
            min="20"
            max="100"
            value={theme.nodeSize}
            onChange={(e) => updateTheme({ nodeSize: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </section>

        {/* Density */}
        <section>
          <label className="block font-semibold text-gray-900 dark:text-white mb-2">
            Density: {theme.density}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={theme.density}
            onChange={(e) => updateTheme({ density: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </section>

        {/* Animation Speed */}
        <section>
          <label className="block font-semibold text-gray-900 dark:text-white mb-2">
            Animation Speed: {theme.animationSpeed}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={theme.animationSpeed}
            onChange={(e) => updateTheme({ animationSpeed: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </section>

        {/* Colors */}
        <section>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Colors</h3>
          <div className="space-y-3">
            {Object.entries(theme.colors).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm text-gray-700 dark:text-gray-300 capitalize">{key}</label>
                <input
                  type="color"
                  value={value}
                  onChange={(e) =>
                    updateTheme({
                      colors: { ...theme.colors, [key]: e.target.value },
                    })
                  }
                  className="w-12 h-8 rounded cursor-pointer"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Line Thickness */}
        <section>
          <label className="block font-semibold text-gray-900 dark:text-white mb-2">
            Line Thickness: {theme.lineThickness}
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={theme.lineThickness}
            onChange={(e) => updateTheme({ lineThickness: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </section>

        {/* Toggles */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900 dark:text-white">Dark Mode</span>
            <button
              onClick={() => updateTheme({ darkMode: !theme.darkMode })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                theme.darkMode ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              aria-pressed={theme.darkMode}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  theme.darkMode ? 'transform translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900 dark:text-white">Enable Hover</span>
            <button
              onClick={() => updateTheme({ enableHover: !theme.enableHover })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                theme.enableHover ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              aria-pressed={theme.enableHover}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  theme.enableHover ? 'transform translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900 dark:text-white">Enable Pulse</span>
            <button
              onClick={() => updateTheme({ enablePulse: !theme.enablePulse })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                theme.enablePulse ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              aria-pressed={theme.enablePulse}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  theme.enablePulse ? 'transform translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
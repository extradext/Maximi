'use client';

import useMapStore from '@/lib/store';
import { motion } from 'framer-motion';

export default function ModeSelector() {
  const mode = useMapStore((state) => state.mode);
  const setMode = useMapStore((state) => state.setMode);

  const modes = [
    { id: 'exploration', label: 'Exploration', icon: '🧭' },
    { id: 'curriculum', label: 'Curriculum', icon: '📚' },
    { id: 'classroom', label: 'Classroom', icon: '🏫' },
    { id: 'publishing', label: 'Publishing', icon: '📤' },
  ] as const;

  return (
    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all ${
            mode === m.id
              ? 'text-white'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
          aria-label={`Switch to ${m.label} mode`}
          aria-pressed={mode === m.id}
        >
          {mode === m.id && (
            <motion.div
              layoutId="activeMode"
              className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md"
              transition={{ type: 'spring', duration: 0.5 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1">
            <span>{m.icon}</span>
            <span className="hidden sm:inline">{m.label}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
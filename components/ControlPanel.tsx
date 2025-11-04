'use client';

import { useState, useEffect, useRef } from 'react';
import useMapStore from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

export default function ControlPanel() {
  const [isExpanded, setIsExpanded] = useState(true);
  const sliders = useMapStore((state) => state.sliders);
  const updateSlider = useMapStore((state) => state.updateSlider);
  const autoRefresh = useMapStore((state) => state.autoRefresh);
  const toggleAutoRefresh = useMapStore((state) => state.toggleAutoRefresh);
  const refreshInterval = useMapStore((state) => state.refreshInterval);
  const setRefreshInterval = useMapStore((state) => state.setRefreshInterval);

  const sliderConfigs = [
    { key: 'commonRare' as const, label: 'Common ↔ Rare', left: 'Common', right: 'Rare' },
    { key: 'newAged' as const, label: 'New ↔ Aged', left: 'New', right: 'Aged' },
    { key: 'mainstreamNiche' as const, label: 'Mainstream ↔ Niche', left: 'Mainstream', right: 'Niche' },
    { key: 'popularUnseen' as const, label: 'Popular ↔ Unseen', left: 'Popular', right: 'Unseen' },
  ];

  const handleSliderChange = (key: keyof typeof sliders, value: number) => {
    updateSlider(key, value);
  };

  const handleRefresh = async () => {
    // TODO: Implement refresh logic
    console.log('Refreshing with current slider settings...');
  };

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      style={{ maxWidth: '380px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">Discovery Controls</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          aria-label={isExpanded ? 'Collapse panel' : 'Expand panel'}
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 space-y-6">
              {/* Sliders */}
              {sliderConfigs.map(({ key, label, left, right }) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{left}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{label}</span>
                    <span className="text-gray-600 dark:text-gray-400">{right}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliders[key]}
                    onChange={(e) => handleSliderChange(key, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    aria-label={`${label} slider`}
                  />
                  <div className="text-center text-xs text-gray-500">{sliders[key]}</div>
                </div>
              ))}

              {/* Refresh Controls */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto Refresh</span>
                  <button
                    onClick={toggleAutoRefresh}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      autoRefresh ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    aria-label="Toggle auto refresh"
                    aria-pressed={autoRefresh}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        autoRefresh ? 'transform translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>

                {autoRefresh && (
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                      Interval (seconds): {refreshInterval}
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="300"
                      step="10"
                      value={refreshInterval}
                      onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                )}

                <button
                  onClick={handleRefresh}
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                  data-testid="manual-refresh-button"
                >
                  🔄 Manual Refresh
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
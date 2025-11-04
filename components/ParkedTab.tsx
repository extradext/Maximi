'use client';

import { useState } from 'react';
import useMapStore from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

export default function ParkedTab() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [customTimer, setCustomTimer] = useState<number | null>(null);
  const [showTimerInput, setShowTimerInput] = useState(false);
  const parkedItems = useMapStore((state) => state.parkedItems);
  const removePark = useMapStore((state) => state.removePark);

  const handleHourglassClick = (id: string) => {
    // Reset timer
    removePark(id);
  };

  const handleHourglassLongPress = (id: string) => {
    // Long press to set custom duration
    setShowTimerInput(true);
  };

  const getRemainingTime = (expiresAt: Date | null): string => {
    if (!expiresAt) return '∞';
    
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      style={{ minWidth: '280px', maxWidth: '320px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⌛</span>
          <h3 className="font-semibold text-gray-900 dark:text-white">Parked</h3>
          {parkedItems.length > 0 && (
            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
              {parkedItems.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          aria-label={isExpanded ? 'Collapse parked items' : 'Expand parked items'}
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
            <div className="px-5 py-4 max-h-96 overflow-y-auto space-y-3">
              {parkedItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                  No parked items yet.
                  <br />
                  Long-press nodes to park them here.
                </div>
              ) : (
                parkedItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                          {item.node.label}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {getRemainingTime(item.expiresAt)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleHourglassClick(item.id)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          handleHourglassLongPress(item.id);
                        }}
                        className="text-xl hover:scale-110 transition-transform"
                        title="Click to remove, right-click for custom timer"
                        aria-label="Remove parked item"
                      >
                        ⌛
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global hourglass button (when collapsed) */}
      {!isExpanded && parkedItems.length > 0 && (
        <div className="px-5 py-2">
          <button
            onClick={() => {
              // Clear all expired
              useMapStore.getState().clearExpiredParks();
            }}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            Clear expired
          </button>
        </div>
      )}
    </motion.div>
  );
}
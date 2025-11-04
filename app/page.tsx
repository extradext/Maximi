'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import StartScreen from '@/components/StartScreen';
import ModeSelector from '@/components/ModeSelector';
import ControlPanel from '@/components/ControlPanel';
import ParkedTab from '@/components/ParkedTab';
import SavedGroupsDropdown from '@/components/SavedGroupsDropdown';
import ThemeCustomizer from '@/components/ThemeCustomizer';
import useMapStore from '@/lib/store';

// Dynamically import MapCanvas to avoid SSR issues
const MapCanvas = dynamic(() => import('@/components/MapCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <div className="text-lg text-gray-500">Loading map...</div>
    </div>
  ),
});

export default function Home() {
  const [isStarted, setIsStarted] = useState(false);
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
  const nodes = useMapStore((state) => state.nodes);
  const mode = useMapStore((state) => state.mode);

  // Clear expired parked items periodically
  useEffect(() => {
    const clearExpired = useMapStore.getState().clearExpiredParks;
    const interval = setInterval(clearExpired, 60000); // Every minute
    return () => clearInterval(interval);
  }, []);

  if (!isStarted) {
    return <StartScreen onStart={() => setIsStarted(true)} />;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Adaptive Map
            </h1>
            <ModeSelector />
          </div>
          
          <div className="flex items-center gap-3">
            <SavedGroupsDropdown />
            <button
              onClick={() => setShowThemeCustomizer(!showThemeCustomizer)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Open theme customizer"
            >
              🎨 Theme
            </button>
          </div>
        </div>
      </header>

      {/* Main Canvas */}
      <div className="pt-16 h-full">
        <MapCanvas />
      </div>

      {/* Control Panel */}
      {mode === 'exploration' && (
        <div className="absolute bottom-6 left-6 z-40">
          <ControlPanel />
        </div>
      )}

      {/* Parked Tab */}
      <div className="absolute bottom-6 right-6 z-40">
        <ParkedTab />
      </div>

      {/* Theme Customizer */}
      {showThemeCustomizer && (
        <div className="absolute top-16 right-0 z-50">
          <ThemeCustomizer onClose={() => setShowThemeCustomizer(false)} />
        </div>
      )}

      {/* Coming Soon Overlay (for feature-flagged features) */}
      {process.env.NEXT_PUBLIC_ENABLE_PAYMENTS === 'true' && (
        <div className="absolute top-20 right-6 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 text-sm text-yellow-800">
          🚀 Pro features coming soon!
        </div>
      )}
    </div>
  );
}
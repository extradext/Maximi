'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    // TODO: Call API to seed the map
    setTimeout(() => {
      onStart();
    }, 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl px-6"
      >
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
        >
          Adaptive Visual Discovery
        </motion.h1>
        
        <motion.p
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-600 dark:text-gray-300 mb-12"
        >
          Explore knowledge dynamically with AI-powered branching search
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <div className="relative w-full max-w-xl mx-auto">
            {/* Central Bubble */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-2xl opacity-20 animate-pulse" />
            
            <form onSubmit={handleSubmit} className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-full shadow-2xl p-4 flex items-center gap-4 border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-600 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Start exploring any topic..."
                  className="flex-1 bg-transparent text-lg outline-none px-4 text-gray-900 dark:text-white placeholder-gray-400"
                  autoFocus
                  disabled={isLoading}
                  aria-label="Enter a topic to explore"
                />
                <span className="cursor-blink text-2xl text-blue-500">|</span>
                
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? 'Loading...' : 'Explore'}
                </button>
              </div>
            </form>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-sm text-gray-500 dark:text-gray-400"
          >
            <p>Try: "Machine Learning", "Ancient Rome", "Climate Change"</p>
          </motion.div>
        </motion.div>

        {/* Feature Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 flex flex-wrap justify-center gap-4"
        >
          {['Exploration', 'Curriculum', 'Classroom', 'Publishing'].map((mode) => (
            <div
              key={mode}
              className="px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            >
              {mode} Mode
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
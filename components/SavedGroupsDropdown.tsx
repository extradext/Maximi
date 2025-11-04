'use client';

import { useState, useEffect } from 'react';
import useMapStore from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

interface Session {
  id: string;
  name: string;
  updatedAt: Date;
  expiresAt?: Date | null;
  isPinned: boolean;
}

export default function SavedGroupsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const currentSessionId = useMapStore((state) => state.currentSessionId);
  const setCurrentSession = useMapStore((state) => state.setCurrentSession);

  // Mock sessions - replace with API call
  useEffect(() => {
    setSessions([
      {
        id: '1',
        name: 'My First Exploration',
        updatedAt: new Date(),
        isPinned: true,
      },
      {
        id: '2',
        name: 'Machine Learning Deep Dive',
        updatedAt: new Date(Date.now() - 86400000),
        expiresAt: new Date(Date.now() + 86400000 * 7),
        isPinned: false,
      },
    ]);
  }, []);

  const handleRename = (id: string, newName: string) => {
    setSessions(sessions.map((s) => (s.id === id ? { ...s, name: newName } : s)));
    setEditingId(null);
  };

  const getExpiryLabel = (expiresAt?: Date | null, isPinned?: boolean): string => {
    if (isPinned) return '📌 Forever';
    if (!expiresAt) return '🗑️ Auto-delete';
    
    const days = Math.ceil((expiresAt.getTime() - Date.now()) / 86400000);
    return `📅 ${days}d left`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        aria-label="Open saved sessions"
        aria-expanded={isOpen}
      >
        <span>💾</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Saved</span>
        <span className="text-xs text-gray-500">({sessions.length})</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto"
            >
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white">Saved Sessions</h4>
              </div>

              <div className="py-2">
                {sessions.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No saved sessions yet
                  </div>
                ) : (
                  sessions.map((session) => (
                    <div
                      key={session.id}
                      className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                        currentSessionId === session.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                      onClick={() => {
                        setCurrentSession(session.id);
                        setIsOpen(false);
                      }}
                    >
                      {editingId === session.id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onBlur={() => handleRename(session.id, editName)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRename(session.id, editName);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-900 border border-blue-500 rounded"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                              {session.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                              <span>{new Date(session.updatedAt).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>{getExpiryLabel(session.expiresAt, session.isPinned)}</span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingId(session.id);
                              setEditName(session.name);
                            }}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            aria-label="Rename session"
                          >
                            ✏️
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    // Create new session
                    console.log('Create new session');
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm"
                  data-testid="create-new-session-button"
                >
                  + New Session
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
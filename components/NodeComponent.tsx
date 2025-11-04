'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import useMapStore, { type Node, type ThemeConfig } from '@/lib/store';

interface NodeComponentProps {
  node: Node;
  theme: ThemeConfig;
  mode: 'exploration' | 'curriculum' | 'classroom' | 'publishing';
}

export default function NodeComponent({ node, theme, mode }: NodeComponentProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  
  const updateNode = useMapStore((state) => state.updateNode);
  const togglePin = useMapStore((state) => state.togglePin);
  const toggleExpand = useMapStore((state) => state.toggleExpand);
  const parkNode = useMapStore((state) => state.parkNode);

  const baseSize = (theme.nodeSize / 100) * 80 + 40; // 40-120px
  const expandedSize = baseSize * (theme.enableHover && isHovered ? 1.15 : 1);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click

    // Start long press timer for park feature
    const timer = setTimeout(() => {
      parkNode(node);
      setLongPressTimer(null);
    }, 800);

    setLongPressTimer(timer);
  };

  const handleMouseUp = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (mode === 'publishing') return; // Read-only mode

    // If pinned, clicking expands/collapses
    if (node.isPinned) {
      toggleExpand(node.id);
    } else {
      // Click to pin
      togglePin(node.id);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mode === 'publishing') return;
    
    // Double-click to expand and generate children
    if (!node.isExpanded) {
      toggleExpand(node.id);
      // TODO: Call API to expand node
      console.log('Expanding node:', node.label);
    }
  };

  // Calculate credibility color based on votes
  const getCredibilityColor = (): string => {
    if (!node.votes || mode !== 'publishing') return theme.colors.primary;
    
    const { up, down } = node.votes;
    const total = up + down;
    if (total === 0) return theme.colors.primary;
    
    const ratio = up / total;
    if (ratio > 0.7) return '#10b981'; // Green
    if (ratio < 0.3) return '#ef4444'; // Red
    return theme.colors.accent; // Yellow/Orange
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        x: node.x - expandedSize / 2,
        y: node.y - expandedSize / 2,
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        duration: Math.min(300, 300 - (theme.animationSpeed / 100) * 200) / 1000,
      }}
      drag={!node.isPinned && mode !== 'publishing'}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(e, info) => {
        setIsDragging(false);
        updateNode(node.id, {
          x: node.x + info.offset.x,
          y: node.y + info.offset.y,
        });
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (longPressTimer) {
          clearTimeout(longPressTimer);
          setLongPressTimer(null);
        }
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className="absolute cursor-pointer select-none"
      style={{
        width: expandedSize,
        height: expandedSize,
      }}
      data-testid={`node-${node.label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {/* Node circle */}
      <div
        className={`w-full h-full rounded-full flex items-center justify-center shadow-lg transition-all ${
          theme.enablePulse && !node.isPinned ? 'node-pulse' : ''
        } ${isDragging ? 'shadow-2xl scale-110' : ''}`}
        style={{
          backgroundColor: theme.colors.primary,
          borderWidth: theme.lineThickness,
          borderColor: getCredibilityColor(),
          borderStyle: 'solid',
        }}
      >
        {/* Pin indicator */}
        {node.isPinned && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs shadow-lg">
            📌
          </div>
        )}

        {/* Expand indicator */}
        {node.isExpanded && node.children && node.children.length > 0 && (
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-xs shadow-lg">
            ✓
          </div>
        )}

        {/* Label */}
        <div
          className="text-center px-2 font-medium"
          style={{
            color: theme.colors.background,
            fontSize: `${Math.max(10, baseSize / 8)}px`,
          }}
        >
          {node.label}
        </div>
      </div>

      {/* Hover tooltip with children preview */}
      {isHovered && theme.enableHover && node.isExpanded && node.children && node.children.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 px-3 py-2 z-50 min-w-max"
        >
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            {node.children.length} connected topics
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

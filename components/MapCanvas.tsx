'use client';

import { useRef, useEffect, useState } from 'react';
import useMapStore, { type Node } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import NodeComponent from './NodeComponent';

export default function MapCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  const nodes = useMapStore((state) => state.nodes);
  const connections = useMapStore((state) => state.connections);
  const theme = useMapStore((state) => state.theme);
  const mode = useMapStore((state) => state.mode);

  // Update canvas dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        setDimensions({
          width: canvasRef.current.offsetWidth,
          height: canvasRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Initialize with seed data if empty
  useEffect(() => {
    if (nodes.length === 0 && mode === 'exploration') {
      // Add initial seed node
      const seedNode: Node = {
        id: crypto.randomUUID(),
        label: 'Start Here',
        x: dimensions.width / 2,
        y: dimensions.height / 2,
        isPinned: false,
        isExpanded: false,
        children: [],
      };
      useMapStore.getState().addNode(seedNode);
    }
  }, [nodes.length, mode, dimensions]);

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full overflow-hidden"
      style={{
        backgroundColor: theme.colors.background,
      }}
    >
      {/* SVG for connections */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width={dimensions.width}
        height={dimensions.height}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill={theme.colors.primary}
              opacity="0.6"
            />
          </marker>
        </defs>

        {connections.map((conn, index) => {
          const fromNode = nodes.find((n) => n.id === conn.from);
          const toNode = nodes.find((n) => n.id === conn.to);

          if (!fromNode || !toNode) return null;

          return (
            <motion.line
              key={`${conn.from}-${conn.to}-${index}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={theme.colors.primary}
              strokeWidth={theme.lineThickness}
              opacity={0.4}
              markerEnd="url(#arrowhead)"
              className={theme.enablePulse ? 'connection-line' : ''}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ duration: 0.5 }}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      <AnimatePresence>
        {nodes.map((node) => (
          <NodeComponent
            key={node.id}
            node={node}
            theme={theme}
            mode={mode}
          />
        ))}
      </AnimatePresence>

      {/* Empty state */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Your map is empty
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Start exploring to populate your discovery map
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  parentId?: string;
  children?: string[];
  isPinned: boolean;
  isExpanded: boolean;
  data?: any;
  votes?: { up: number; down: number };
}

export interface Connection {
  from: string;
  to: string;
}

export interface MapState {
  // Nodes and connections
  nodes: Node[];
  connections: Connection[];
  
  // Current mode
  mode: 'exploration' | 'curriculum' | 'classroom' | 'publishing';
  
  // Exploration mode settings
  sliders: {
    commonRare: number;      // 0-100
    newAged: number;         // 0-100
    mainstreamNiche: number; // 0-100
    popularUnseen: number;   // 0-100
  };
  
  autoRefresh: boolean;
  refreshInterval: number; // in seconds
  
  // Visual settings
  showConnections: boolean;
  showPulse: boolean;
  
  // Parked items
  parkedItems: Array<{
    id: string;
    node: Node;
    expiresAt: Date | null;
    customTimer?: number;
  }>;
  
  // Theme
  theme: ThemeConfig;
  
  // Session
  currentSessionId: string | null;
  
  // Actions
  addNode: (node: Node) => void;
  updateNode: (id: string, updates: Partial<Node>) => void;
  removeNode: (id: string) => void;
  togglePin: (id: string) => void;
  toggleExpand: (id: string) => void;
  
  addConnection: (from: string, to: string) => void;
  removeConnection: (from: string, to: string) => void;
  
  setMode: (mode: MapState['mode']) => void;
  updateSlider: (key: keyof MapState['sliders'], value: number) => void;
  toggleAutoRefresh: () => void;
  setRefreshInterval: (interval: number) => void;
  
  parkNode: (node: Node, customTimer?: number) => void;
  removePark: (id: string) => void;
  clearExpiredParks: () => void;
  
  updateTheme: (updates: Partial<ThemeConfig>) => void;
  loadThemePreset: (preset: ThemeConfig) => void;
  
  setCurrentSession: (sessionId: string | null) => void;
  clearMap: () => void;
}

export interface ThemeConfig {
  nodeSize: number;        // 0-100
  density: number;         // 0-100
  animationSpeed: number;  // 0-100
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  font: string;
  lineThickness: number;   // 1-5
  darkMode: boolean;
  enableHover: boolean;
  enablePulse: boolean;
}

const defaultTheme: ThemeConfig = {
  nodeSize: 50,
  density: 50,
  animationSpeed: 70,
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    background: '#ffffff',
    text: '#1f2937',
    accent: '#f59e0b',
  },
  font: 'Inter',
  lineThickness: 2,
  darkMode: false,
  enableHover: true,
  enablePulse: true,
};

export const useMapStore = create<MapState>()(  devtools(
    persist(
      (set, get) => ({
        nodes: [],
        connections: [],
        mode: 'exploration',
        sliders: {
          commonRare: 50,
          newAged: 50,
          mainstreamNiche: 50,
          popularUnseen: 50,
        },
        autoRefresh: false,
        refreshInterval: 30,
        showConnections: true,
        showPulse: true,
        parkedItems: [],
        theme: defaultTheme,
        currentSessionId: null,

        addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
        
        updateNode: (id, updates) =>
          set((state) => ({
            nodes: state.nodes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
          })),
        
        removeNode: (id) =>
          set((state) => ({
            nodes: state.nodes.filter((n) => n.id !== id),
            connections: state.connections.filter((c) => c.from !== id && c.to !== id),
          })),
        
        togglePin: (id) =>
          set((state) => ({
            nodes: state.nodes.map((n) =>
              n.id === id ? { ...n, isPinned: !n.isPinned } : n
            ),
          })),
        
        toggleExpand: (id) =>
          set((state) => ({
            nodes: state.nodes.map((n) =>
              n.id === id ? { ...n, isExpanded: !n.isExpanded } : n
            ),
          })),
        
        addConnection: (from, to) =>
          set((state) => ({
            connections: [...state.connections, { from, to }],
          })),
        
        removeConnection: (from, to) =>
          set((state) => ({
            connections: state.connections.filter(
              (c) => !(c.from === from && c.to === to)
            ),
          })),
        
        setMode: (mode) => set({ mode }),
        
        updateSlider: (key, value) =>
          set((state) => ({
            sliders: { ...state.sliders, [key]: value },
          })),
        
        toggleAutoRefresh: () => set((state) => ({ autoRefresh: !state.autoRefresh })),
        
        setRefreshInterval: (interval) => set({ refreshInterval: interval }),
        
        parkNode: (node, customTimer) =>
          set((state) => ({
            parkedItems: [
              ...state.parkedItems,
              {
                id: crypto.randomUUID(),
                node,
                expiresAt: customTimer
                  ? new Date(Date.now() + customTimer * 60 * 1000)
                  : null,
                customTimer,
              },
            ],
          })),
        
        removePark: (id) =>
          set((state) => ({
            parkedItems: state.parkedItems.filter((p) => p.id !== id),
          })),
        
        clearExpiredParks: () =>
          set((state) => ({
            parkedItems: state.parkedItems.filter(
              (p) => !p.expiresAt || p.expiresAt > new Date()
            ),
          })),
        
        updateTheme: (updates) =>
          set((state) => ({
            theme: { ...state.theme, ...updates },
          })),
        
        loadThemePreset: (preset) => set({ theme: preset }),
        
        setCurrentSession: (sessionId) => set({ currentSessionId: sessionId }),
        
        clearMap: () =>
          set({
            nodes: [],
            connections: [],
            parkedItems: [],
          }),
      }),
      {
        name: 'adaptive-map-storage',
        partialize: (state) => ({
          theme: state.theme,
          sliders: state.sliders,
          autoRefresh: state.autoRefresh,
          refreshInterval: state.refreshInterval,
        }),
      }
    )
  )
);

export default useMapStore;
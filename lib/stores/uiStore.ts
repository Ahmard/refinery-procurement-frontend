import { create } from 'zustand';

/**
 * UI Store State
 */
interface UIState {
  // Sidebar state
  sidebarCollapsed: boolean;
  sidebarVisible: boolean; // For mobile drawer
  
  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarVisible: (visible: boolean) => void;
}

/**
 * UI Zustand Store
 * 
 * Manages UI state like sidebar collapse/expand
 */
export const useUIStore = create<UIState>()((set) => ({
  // Initial state
  sidebarCollapsed: false,
  sidebarVisible: true,
  
  // Toggle sidebar collapsed state
  toggleSidebar: () => {
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
  },
  
  // Set sidebar collapsed state explicitly
  setSidebarCollapsed: (collapsed: boolean) => {
    set({ sidebarCollapsed: collapsed });
  },
  
  // Set sidebar visibility (for mobile)
  setSidebarVisible: (visible: boolean) => {
    set({ sidebarVisible: visible });
  },
}));

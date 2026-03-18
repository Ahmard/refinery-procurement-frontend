import { useCallback, useMemo } from 'react';
import { useDraftPOStore } from '../stores/draftPOStore';
import type { DraftPOItem, Uuid } from '@/lib/types';

/**
 * Custom Hook - Draft PO Store Accessor
 * 
 * Provides convenient access to draft PO state and actions
 * with proper React hooks integration
 */
export function useDraftPO() {
  // Select all state at once (triggers re-render on any change)
  const supplierId = useDraftPOStore((state) => state.supplierId);
  const supplierName = useDraftPOStore((state) => state.supplierName);
  const items = useDraftPOStore((state) => state.items);
  const header = useDraftPOStore((state) => state.header);
  const createdAt = useDraftPOStore((state) => state.createdAt);
  const updatedAt = useDraftPOStore((state) => state.updatedAt);
  
  // Select item count directly to trigger re-renders when items change
  const itemCount = useDraftPOStore((state) => state.items.size);
  
  // Get actions (these are stable references)
  const canAddItem = useDraftPOStore((state) => state.canAddItem);
  const addItem = useDraftPOStore((state) => state.addItem);
  const removeItem = useDraftPOStore((state) => state.removeItem);
  const updateQuantity = useDraftPOStore((state) => state.updateQuantity);
  const setSupplier = useDraftPOStore((state) => state.setSupplier);
  const clearDraft = useDraftPOStore((state) => state.clearDraft);
  const exportState = useDraftPOStore((state) => state.exportState);
  const importState = useDraftPOStore((state) => state.importState);
  
  /**
   * Check if draft has items
   */
  const hasItems = useMemo(() => itemCount > 0, [itemCount]);
  
  /**
   * Check if supplier is locked
   */
  const isSupplierLocked = useMemo(() => supplierId !== null, [supplierId]);
  
  /**
   * Get item by ID
   */
  const getItem = useCallback((catalogItemId: string): DraftPOItem | undefined => {
    return items.get(catalogItemId);
  }, [items]);
  
  /**
   * Check if item exists in draft
   */
  const hasItem = useCallback((catalogItemId: string): boolean => {
    return items.has(catalogItemId);
  }, [items]);
  
  /**
   * Get all items as array
   */
  const itemsArray = useMemo(() => Array.from(items.values()), [items]);
  
  /**
   * Persist draft to localStorage manually
   * (Can also use zustand persist middleware if needed)
   */
  const persistToStorage = useCallback(() => {
    try {
      const state = exportState();
      localStorage.setItem('draft_po_state', JSON.stringify(state));
      console.log('[DraftPO] State persisted to localStorage');
    } catch (error) {
      console.error('[DraftPO] Failed to persist state:', error);
    }
  }, [exportState]);
  
  /**
   * Restore draft from localStorage
   */
  const restoreFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem('draft_po_state');
      if (stored) {
        const state = JSON.parse(stored);
        importState(state);
        console.log('[DraftPO] State restored from localStorage');
        return true;
      }
    } catch (error) {
      console.error('[DraftPO] Failed to restore state:', error);
    }
    return false;
  }, [importState]);
  
  /**
   * Clear draft and remove from storage
   */
  const clearAndRemove = useCallback(() => {
    clearDraft();
    localStorage.removeItem('draft_po_state');
    console.log('[DraftPO] Draft cleared and removed from storage');
  }, [clearDraft]);
  
  return {
    // State
    supplierId,
    supplierName,
    items,
    header,
    createdAt,
    updatedAt,
    
    // Computed values
    itemCount,
    hasItems,
    isSupplierLocked,
    
    // Actions
    canAddItem,
    addItem,
    removeItem,
    updateQuantity,
    setSupplier,
    clearDraft,
    
    // Helpers
    getItem,
    hasItem,
    itemsArray,
    
    // Persistence
    persistToStorage,
    restoreFromStorage,
    clearAndRemove,
    exportState,
    importState,
  };
}

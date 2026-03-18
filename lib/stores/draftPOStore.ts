import { create } from 'zustand';
import Decimal from 'decimal.js';
import type { Uuid, DecimalString, DateTime, DraftPOItem, DraftPurchaseOrder } from '@/lib/types';
import * as MoneyUtils from '@/lib/utils/money';

/**
 * Result type for operations that can fail (supplier mismatch)
 */
export type Result<T, E = string> = 
  | { ok: true; value: T }
  | { ok: false; error: E };

/**
 * Draft PO State Interface
 */
interface DraftPOState {
  // Supplier lock state
  supplierId: Uuid | null;
  supplierName: string | null;
  
  // Items map for O(1) lookups
  items: Map<string, DraftPOItem>;
  
  // Header data
  header: {
    requestor?: string;
    cost_center?: string;
    payment_terms?: string;
    needed_by_date?: DateTime;
  } | null;
  
  // Metadata
  createdAt: DateTime;
  updatedAt: DateTime;
  
  // Actions
  /**
   * Check if item can be added (supplier match check)
   */
  canAddItem: (itemSupplierId: Uuid) => boolean;
  
  /**
   * Add item to draft PO with supplier lock enforcement
   * Returns Result type for error handling
   */
  addItem: (item: DraftPOItem, supplierId: Uuid, supplierName: string) => Result<void>;
  
  /**
   * Remove item from draft PO
   */
  removeItem: (catalogItemId: string) => void;
  
  /**
   * Update quantity of existing item
   */
  updateQuantity: (catalogItemId: string, quantity: number) => Result<void>;
  
  /**
   * Set supplier (locks the PO to this supplier)
   */
  setSupplier: (supplierId: Uuid, supplierName: string) => void;
  
  /**
   * Clear entire draft PO
   */
  clearDraft: () => void;
  
  /**
   * Get total amount using Decimal.js
   */
  getTotal: () => Decimal;
  
  /**
   * Get total as formatted string
   */
  getTotalFormatted: () => DecimalString;
  
  /**
   * Get item count
   */
  getItemCount: () => number;
  
  /**
   * Export draft state for persistence
   */
  exportState: () => any;
  
  /**
   * Import/restore draft state from persistence
   */
  importState: (state: any) => void;
}

/**
 * Helper function to serialize Map to JSON
 */
function serializeMap(map: Map<string, DraftPOItem>): any[] {
  return Array.from(map.entries());
}

/**
 * Helper function to deserialize Map from JSON
 */
function deserializeMap(data: any[]): Map<string, DraftPOItem> {
  return new Map(data);
}

/**
 * Create initial state factory function
 */
const createInitialState = (): Omit<DraftPOState, 'canAddItem' | 'addItem' | 'removeItem' | 'updateQuantity' | 'setSupplier' | 'clearDraft' | 'getTotal' | 'getTotalFormatted' | 'getItemCount' | 'exportState' | 'importState'> => ({
  supplierId: null,
  supplierName: null,
  items: new Map(),
  header: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

/**
 * Draft PO Store - Zustand Store with Supplier Lock Logic
 * 
 * CRITICAL BUSINESS RULE:
 * - First item added defines/locks the supplier for the entire PO
 * - Subsequent items from different suppliers are rejected
 * - Enforced at client level (also enforced at API level)
 */
export const useDraftPOStore = create<DraftPOState>()((set, get) => ({
  ...createInitialState(),
  
  /**
   * Check if item can be added based on supplier match
   */
  canAddItem: (itemSupplierId: Uuid): boolean => {
    const { supplierId } = get();
    
    // If no supplier locked yet, any item can be added
    if (!supplierId) {
      return true;
    }
    
    // Otherwise, supplier must match
    return supplierId === itemSupplierId;
  },
  
  /**
   * Add item with supplier lock enforcement
   * Returns Result type for proper error handling
   */
  addItem: (item: DraftPOItem, supplierId: Uuid, supplierName: string): Result<void> => {
    const state = get();
    
    // Check supplier constraint
    if (!state.canAddItem(supplierId)) {
      return {
        ok: false,
        error: `Cannot add items from multiple suppliers. Current supplier: ${state.supplierName}`,
      };
    }
    
    // Create new items map with added item
    const newItems = new Map(state.items);
    newItems.set(item.catalog_item_id, item);
    
    set({
      items: newItems,
      supplierId: state.supplierId || supplierId,
      supplierName: state.supplierName || supplierName,
      updatedAt: new Date().toISOString(),
    });
    
    return { ok: true, value: undefined };
  },
  
  /**
   * Remove item from draft
   */
  removeItem: (catalogItemId: string): void => {
    const state = get();
    const newItems = new Map(state.items);
    newItems.delete(catalogItemId);
    
    // If last item removed, also clear supplier lock
    const shouldClearSupplier = newItems.size === 0;
    
    set({
      items: newItems,
      supplierId: shouldClearSupplier ? null : state.supplierId,
      supplierName: shouldClearSupplier ? null : state.supplierName,
      updatedAt: new Date().toISOString(),
    });
  },
  
  /**
   * Update quantity of existing item
   */
  updateQuantity: (catalogItemId: string, quantity: number): Result<void> => {
    const state = get();
    const item = state.items.get(catalogItemId);
    
    if (!item) {
      return {
        ok: false,
        error: 'Item not found in draft PO',
      };
    }
    
    if (quantity < 1) {
      return {
        ok: false,
        error: 'Quantity must be at least 1',
      };
    }
    
    // Update item with new quantity and recalculate total
    const updatedItem: DraftPOItem = {
      ...item,
      quantity,
      total_price: MoneyUtils.calculateLineTotal(item.unit_price, quantity).toString(),
    };
    
    const newItems = new Map(state.items);
    newItems.set(catalogItemId, updatedItem);
    
    set({
      items: newItems,
      updatedAt: new Date().toISOString(),
    });
    
    return { ok: true, value: undefined };
  },
  
  /**
   * Set supplier (locks PO to this supplier)
   */
  setSupplier: (supplierId: Uuid, supplierName: string): void => {
    set({
      supplierId,
      supplierName,
      updatedAt: new Date().toISOString(),
    });
  },
  
  /**
   * Clear entire draft PO
   */
  clearDraft: (): void => {
    set(createInitialState());
  },
  
  /**
   * Calculate total amount using Decimal.js
   */
  getTotal: (): Decimal => {
    const { items } = get();
    const lineTotals = Array.from(items.values()).map(item => item.total_price);
    return MoneyUtils.calculateOrderTotal(lineTotals);
  },
  
  /**
   * Get total as formatted decimal string
   */
  getTotalFormatted: (): DecimalString => {
    return get().getTotal().toFixed(2);
  },
  
  /**
   * Get total item count
   */
  getItemCount: (): number => {
    return get().items.size;
  },
  
  /**
   * Export state for localStorage persistence
   */
  exportState: (): any => {
    const state = get();
    return {
      supplierId: state.supplierId,
      supplierName: state.supplierName,
      items: serializeMap(state.items),
      header: state.header,
      createdAt: state.createdAt,
      updatedAt: state.updatedAt,
    };
  },
  
  /**
   * Import state from localStorage persistence
   */
  importState: (data: any): void => {
    if (!data) return;
    
    set({
      supplierId: data.supplierId || null,
      supplierName: data.supplierName || null,
      items: deserializeMap(data.items || []),
      header: data.header || null,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
    });
  },
}));

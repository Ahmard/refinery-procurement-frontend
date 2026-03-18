import { useState, useEffect } from 'react';
import { procurementApi, PurchaseOrderResponse } from '@/lib/api/procurement';

/**
 * Hook to fetch purchase order details
 * 
 * @param orderId - The UUID of the purchase order to fetch
 * @returns Object containing data, loading, error, and refetch
 */
export function usePurchaseOrder(orderId?: string) {
  const [data, setData] = useState<PurchaseOrderResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    if (!orderId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await procurementApi.getDetails(orderId);
      setData(response.data);
    } catch (err: any) {
      console.error('[usePurchaseOrder] Error fetching PO:', err);
      setError(err.response?.data?.message || 'Failed to load purchase order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  return {
    data,
    loading,
    error,
    refetch: fetchOrder,
  };
}

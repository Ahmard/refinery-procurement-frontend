'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Form, InputNumber, Typography, Space, Alert } from 'antd';
import type { ModalProps } from 'antd';
import type { CatalogItemResponse } from '@/lib/types';
import { calculateLineTotal } from '@/lib/utils/money';
import { formatCurrency } from '@/lib/utils/formatters';

const { Title, Text } = Typography;

/**
 * AddToPoModal Props
 */
export interface AddToPoModalProps extends Omit<ModalProps, 'title' | 'onOk'> {
  /** Catalog item to add */
  item: CatalogItemResponse | null;
  
  /** Callback when "Add to PO" is confirmed */
  onConfirm?: (quantity: number) => void;
  
  /** Loading state */
  loading?: boolean;
}

/**
 * Add to PO Modal Component
 * 
 * Modal for adding items to draft purchase order with:
 * - Quantity input with validation (> 0)
 * - Real-time total calculation (price × quantity using Decimal.js)
 * - Add button disabled until valid quantity
 * - Clear visual hierarchy
 */
export const AddToPoModal: React.FC<AddToPoModalProps> = ({
  item,
  onConfirm,
  loading = false,
  ...modalProps
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [lineTotal, setLineTotal] = useState<string>('');

  // Reset quantity when item changes
  useEffect(() => {
    if (item) {
      setQuantity(1);
    }
  }, [item]);

  // Calculate line total whenever quantity or item changes
  useEffect(() => {
    if (item && quantity > 0) {
      try {
        const total = calculateLineTotal(item.price_usd, quantity);
        setLineTotal(formatCurrency(total));
      } catch (error) {
        setLineTotal('Invalid price');
      }
    } else {
      setLineTotal('');
    }
  }, [item, quantity]);

  /**
   * Handle modal OK
   */
  const handleOk = () => {
    if (quantity > 0 && item) {
      onConfirm?.(quantity);
    }
  };

  /**
   * Handle quantity change
   */
  const handleQuantityChange = (value: number | null) => {
    if (value !== null && value > 0) {
      setQuantity(value);
    }
  };

  return (
    <Modal
      title="Add Item to Purchase Order"
      okText="Add to PO"
      cancelText="Cancel"
      confirmLoading={loading}
      onOk={handleOk}
      destroyOnClose
      {...modalProps}
    >
      {item ? (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {/* Item Information */}
          <div>
            <Title level={5} style={{ marginBottom: 4 }}>{item.name}</Title>
            <Text type="secondary">ID: {item.secondary_id}</Text>
          </div>

          {/* Price Display */}
          <div>
            <Text strong>Unit Price: </Text>
            <Text type="success" strong style={{ fontSize: 18 }}>
              {formatCurrency(item.price_usd)}
            </Text>
          </div>

          {/* Quantity Input */}
          <Form.Item
            label="Quantity"
            required
            validateStatus={quantity <= 0 ? 'error' : 'success'}
            help={quantity <= 0 ? 'Quantity must be greater than 0' : undefined}
          >
            <InputNumber
              min={1}
              max={9999}
              value={quantity}
              onChange={handleQuantityChange}
              style={{ width: '100%' }}
              size="large"
              formatter={(value) => `${value}`.replace(/\D/g, '')}
              parser={(value) => Number(value?.replace(/[^0-9]/g, ''))}
            />
          </Form.Item>

          {/* Line Total Calculation */}
          <Alert
            type="info"
            showIcon
            message={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong>Line Total:</Text>
                <Text strong type="success" style={{ fontSize: 20 }}>
                  {lineTotal || '$0.00'}
                </Text>
              </div>
            }
            description={
              <Text type="secondary" style={{ fontSize: 12 }}>
                {formatCurrency(item.price_usd)} × {quantity} = {lineTotal}
              </Text>
            }
          />

          {/* Supplier Info */}
          {item.supplier_id && (
            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Supplier: {item.supplier_id}
              </Text>
            </div>
          )}

          {/* Lead Time */}
          {item.lead_time_days !== undefined && (
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Lead Time: {item.lead_time_days} days
              </Text>
            </div>
          )}
        </Space>
      ) : (
        <Text type="secondary">No item selected</Text>
      )}
    </Modal>
  );
};

export default AddToPoModal;

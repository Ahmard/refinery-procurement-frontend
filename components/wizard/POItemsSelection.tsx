'use client';

import React, { useState, useMemo } from 'react';
import { Typography, Divider, Space, Button, Tag, Empty, Table, Row, Col } from 'antd';
import type { TableProps } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import type { DraftPOItem } from '@/lib/types';
import { formatCurrency } from '@/lib/utils/formatters';
import { useDraftPO } from '@/lib/hooks/useDraftPO';
import { CatalogItemCard, AddToPoModal } from '@/components/ui';

const { Title, Text, Paragraph } = Typography;

/**
 * Wizard Step 2 - Items Selection Props
 */
export interface POItemsSelectionProps {
  /** Callback when items are added/removed (for wizard validation) */
  onItemsChange?: (items: Map<string, DraftPOItem>) => void;
  
  /** Loading state */
  loading?: boolean;
}

/**
 * Wizard Step 2 - Items Selection Component
 * 
 * Embedded catalog search and item management in wizard:
 * - Catalog search interface
 * - Selected items list with quantities
 * - Inline quantity editing
 * - Remove item buttons
 * - Supplier lock enforcement
 * - Total amount calculation
 */
export const POItemsSelection: React.FC<POItemsSelectionProps> = ({
  onItemsChange,
  loading = false,
}) => {
  // Use draft PO store
  const {
    items,
    supplierId,
    supplierName,
    itemCount,
    isSupplierLocked,
    addItem,
    removeItem,
    updateQuantity,
  } = useDraftPO();
  
  // Calculate total from items
  const totalFormatted = useMemo(() => {
    const total = Array.from(items.values()).reduce((sum, item) => {
      return sum + parseFloat(item.total_price);
    }, 0);
    return `$${total.toFixed(2)}`;
  }, [items]);

  // State for "Add Item" modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<any | null>(null);

  /**
   * Handle adding item from catalog
   */
  const handleAddToPo = (catalogItem: any) => {
    setSelectedCatalogItem(catalogItem);
    setModalVisible(true);
  };

  /**
   * Handle modal confirmation
   */
  const handleModalConfirm = (quantity: number) => {
    if (selectedCatalogItem) {
      const result = addItem(
        { ...selectedCatalogItem, quantity },
        selectedCatalogItem.supplier_id,
        selectedCatalogItem.supplier_name || 'Unknown Supplier'
      );
      
      if (result.ok) {
        setModalVisible(false);
        setSelectedCatalogItem(null);
        onItemsChange?.(items);
      } else {
        // Error is handled by the store (supplier mismatch)
        setModalVisible(false);
        setSelectedCatalogItem(null);
      }
    }
  };

  /**
   * Handle removing item
   */
  const handleRemoveItem = (catalogItemId: string) => {
    removeItem(catalogItemId);
    onItemsChange?.(items);
  };

  /**
   * Handle quantity update
   */
  const handleUpdateQuantity = (catalogItemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(catalogItemId, newQuantity);
      onItemsChange?.(items);
    }
  };

  /**
   * Table columns for selected items
   */
  const columns: TableProps<DraftPOItem>['columns'] = [
    {
      title: 'Item',
      dataIndex: 'item_name',
      key: 'item_name',
      width: '40%',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>ID: {record.catalog_item_id}</Text>
        </div>
      ),
    },
    {
      title: 'Unit Price',
      dataIndex: 'unit_price',
      key: 'unit_price',
      width: '20%',
      render: (price: string) => (
        <Text>{formatCurrency(price)}</Text>
      ),
    },
    {
      title: 'Quantity',
      key: 'quantity',
      width: '15%',
      render: (_, record) => (
        <input
          type="number"
          min={1}
          value={record.quantity}
          onChange={(e) => handleUpdateQuantity(record.catalog_item_id, parseInt(e.target.value) || 0)}
          style={{ width: 60, padding: 4 }}
        />
      ),
    },
    {
      title: 'Total',
      key: 'total',
      width: '15%',
      render: (_, record) => (
        <Text strong type="success">
          {formatCurrency(record.total_price)}
        </Text>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<MinusCircleOutlined />}
          onClick={() => handleRemoveItem(record.catalog_item_id)}
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={4}>Select Items</Title>
      <Paragraph style={{ color: '#666', marginBottom: 24 }}>
        Add items to your purchase order from the catalog
      </Paragraph>

      {/* Supplier Lock Status */}
      {isSupplierLocked && (
        <div style={{ marginBottom: 16 }}>
          <Tag color="blue">
            Supplier Locked: {supplierName}
          </Tag>
          <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
            Only items from this supplier can be added
          </Text>
        </div>
      )}

      {/* Add Item Button */}
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleAddToPo({
            id: 'temp-id',
            name: 'Sample Item',
            secondary_id: 'SAMPLE-001',
            price_usd: 100,
            supplier_id: supplierId || 'supplier-1',
          })}
          disabled={false} // In real implementation, this opens catalog search
        >
          Add Item from Catalog
        </Button>
      </div>

      {/* Selected Items Table */}
      {itemCount > 0 ? (
        <>
          <Table
            columns={columns}
            dataSource={Array.from(items.values())}
            rowKey="catalog_item_id"
            pagination={false}
            size="middle"
            bordered
          />

          {/* Total Amount */}
          <Divider />
          <Row justify="end">
            <Col>
              <Space size="large">
                <Text strong>Total Items:</Text>
                <Text strong>{itemCount}</Text>
                <Text strong>Grand Total:</Text>
                <Text strong type="success" style={{ fontSize: 20 }}>
                  {totalFormatted}
                </Text>
              </Space>
            </Col>
          </Row>
        </>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No items added yet"
        >
          <Text type="secondary">
            Click "Add Item from Catalog" to start building your purchase order
          </Text>
        </Empty>
      )}

      {/* Add to PO Modal */}
      <AddToPoModal
        open={modalVisible}
        item={selectedCatalogItem}
        onConfirm={handleModalConfirm}
        onCancel={() => {
          setModalVisible(false);
          setSelectedCatalogItem(null);
        }}
        loading={loading}
      />
    </div>
  );
};

export default POItemsSelection;

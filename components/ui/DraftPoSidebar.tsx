'use client';

import React from 'react';
import { Drawer, List, Typography, Space, Button, Badge, Divider, Empty, Popconfirm } from 'antd';
import type { DrawerProps } from 'antd';
import { MinusCircleOutlined, ClearOutlined, ShoppingCartOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import type { DraftPOItem } from '@/lib/types';
import { formatCurrency } from '@/lib/utils/formatters';

const { Title, Text } = Typography;

/**
 * DraftPoSidebar Props
 */
export interface DraftPoSidebarProps extends Omit<DrawerProps, 'title'> {
  /** Items in the draft PO */
  items: Map<string, DraftPOItem>;
  
  /** Supplier ID (if locked) */
  supplierId: string | null;
  
  /** Supplier name (if locked) */
  supplierName: string | null;
  
  /** Total amount */
  total: string;
  
  /** Callback to remove an item */
  onRemoveItem?: (catalogItemId: string) => void;
  
  /** Callback to clear all items */
  onClearDraft?: () => void;
  
  /** Callback to proceed to create PO */
  onProceed?: () => void;
  
  /** Loading state for actions */
  loading?: boolean;
}

/**
 * Draft PO Sidebar/Drawer Component
 * 
 * Persistent sidebar showing current draft PO state with:
 * - Supplier lock status indicator
 * - List of all items with quantities
 * - Running total using Decimal.js
 * - Remove item buttons
 * - Clear draft button with confirmation
 * - "Proceed to Create PO" button
 */
export const DraftPoSidebar: React.FC<DraftPoSidebarProps> = ({
  items,
  supplierId,
  supplierName,
  total,
  onRemoveItem,
  onClearDraft,
  onProceed,
  loading = false,
  ...drawerProps
}) => {
  /**
   * Convert items Map to array for rendering
   */
  const itemsArray = React.useMemo(() => {
    return Array.from(items.values());
  }, [items]);

  /**
   * Check if supplier is locked
   */
  const isSupplierLocked = supplierId !== null && supplierName !== null;

  /**
   * Render supplier lock status
   */
  const renderSupplierLock = () => (
    <div style={{ marginBottom: 16 }}>
      {isSupplierLocked ? (
        <Badge
          count={<LockOutlined />}
          text={
            <Text strong type="success">
              Supplier Locked: {supplierName}
            </Text>
          }
        />
      ) : (
        <Badge
          count={<UnlockOutlined />}
          text={
            <Text type="secondary">
              No supplier selected
            </Text>
          }
        />
      )}
    </div>
  );

  /**
   * Render empty state
   */
  const renderEmpty = () => (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description="No items in draft PO"
    >
      <Text type="secondary" style={{ fontSize: 12 }}>
        Add items from the catalog to start building your PO
      </Text>
    </Empty>
  );

  /**
   * Render item list
   */
  const renderItemList = () => (
    <List
      dataSource={itemsArray}
      renderItem={(item) => (
        <List.Item
          actions={[
            <Popconfirm
              key="remove"
              title="Remove Item"
              description="Are you sure you want to remove this item?"
              onConfirm={() => onRemoveItem?.(item.catalog_item_id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="text"
                danger
                icon={<MinusCircleOutlined />}
                size="small"
              >
                Remove
              </Button>
            </Popconfirm>,
          ]}
        >
          <List.Item.Meta
            title={
              <Space split={<Text type="secondary"> × </Text>}>
                <Text>{item.item_name}</Text>
                <Text strong>{item.quantity}</Text>
              </Space>
            }
            description={
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {formatCurrency(item.unit_price)} each
                </Text>
                <Text strong type="success">
                  {formatCurrency(item.total_price)}
                </Text>
              </Space>
            }
          />
        </List.Item>
      )}
    />
  );

  /**
   * Render totals section
   */
  const renderTotals = () => (
    <>
      <Divider />
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text type="secondary">Items:</Text>
          <Text strong>{itemsArray.length}</Text>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text strong>Total:</Text>
          <Text strong type="success" style={{ fontSize: 18 }}>
            {total || '$0.00'}
          </Text>
        </div>
      </div>
    </>
  );

  /**
   * Render action buttons
   */
  const renderActions = () => (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {itemsArray.length > 0 && (
        <Popconfirm
          title="Clear Draft PO"
          description="Are you sure you want to clear all items from this draft PO?"
          onConfirm={onClearDraft}
          okText="Yes, Clear All"
          cancelText="Cancel"
          okButtonProps={{ danger: true }}
        >
          <Button
            danger
            block
            icon={<ClearOutlined />}
            loading={loading}
          >
            Clear Draft
          </Button>
        </Popconfirm>
      )}
      
      <Button
        type="primary"
        block
        size="large"
        icon={<ShoppingCartOutlined />}
        onClick={onProceed}
        disabled={itemsArray.length === 0}
        loading={loading}
      >
        Proceed to Create PO
      </Button>
    </Space>
  );

  return (
    <Drawer
      title={
        <Space>
          <ShoppingCartOutlined />
          <span>Draft Purchase Order</span>
        </Space>
      }
      placement="right"
      {...drawerProps}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* Supplier Lock Status */}
        {renderSupplierLock()}

        {/* Items List or Empty State */}
        {itemsArray.length > 0 ? renderItemList() : renderEmpty()}

        {/* Totals */}
        {itemsArray.length > 0 && renderTotals()}

        {/* Action Buttons */}
        {renderActions()}
      </Space>
    </Drawer>
  );
};

export default DraftPoSidebar;

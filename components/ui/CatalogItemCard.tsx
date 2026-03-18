'use client';

import React from 'react';
import { Card, Badge, Typography, Space, Button } from 'antd';
import type { CardProps } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import type { CatalogItemResponse } from '@/lib/types';
import { formatCurrency } from '@/lib/utils/formatters';

const { Title, Text } = Typography;

/**
 * Catalog Item Card Props
 */
export interface CatalogItemCardProps extends Omit<CardProps, 'title'> {
  /** Catalog item data */
  item: CatalogItemResponse;
  
  /** Show "Add to PO" button */
  showAddToPo?: boolean;
  
  /** Callback when "Add to PO" is clicked */
  onAddToPo?: (item: CatalogItemResponse) => void;
  
  /** Custom className */
  className?: string;
}

/**
 * Catalog Item Card Component
 * 
 * Displays a single catalog item with:
 * - Name and secondary ID
 * - Category badge
 * - Price (prominent display)
 * - Lead time
 * - In-stock status
 * - Supplier name
 * - Specs preview (first 2-3 key-value pairs)
 * - Optional "Add to PO" button
 * 
 * Works in both grid and list view layouts
 */
export const CatalogItemCard: React.FC<CatalogItemCardProps> = ({
  item,
  showAddToPo = false,
  onAddToPo,
  className,
  ...cardProps
}) => {
  /**
   * Get first few specs for preview
   */
  const getSpecsPreview = () => {
    if (!item.specs) return null;
    
    const entries = Object.entries(item.specs);
    const preview = entries.slice(0, 3);
    
    return preview.map(([key, value]) => (
      <div key={key} style={{ marginBottom: 4 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>{key}: </Text>
        <Text style={{ fontSize: 12 }}>{String(value)}</Text>
      </div>
    ));
  };

  /**
   * Render category badge
   */
  const renderCategoryBadge = () => {
    const colors: Record<string, string> = {
      PUMPS: 'blue',
      VALVES: 'green',
      FITTINGS: 'orange',
      TUBING: 'purple',
      INSTRUMENTATION: 'cyan',
      ELECTRICAL: 'red',
      MECHANICAL: 'gold',
      SAFETY: 'magenta',
      OTHER: 'default',
    };
    
    return (
      <Badge
        color={colors[item.category] || 'default'}
        text={item.category}
        style={{ marginBottom: 8 }}
      />
    );
  };

  /**
   * Render stock status
   */
  const renderStockStatus = () => (
    <Text type={item.in_stock ? 'success' : 'secondary'} style={{ fontSize: 12 }}>
      {item.in_stock ? '✓ In Stock' : '○ Out of Stock'}
    </Text>
  );

  return (
    <Card
      className={className}
      hoverable
      {...cardProps}
      title={null}
      actions={showAddToPo ? [
        <Button
          key="add"
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={() => onAddToPo?.(item)}
          block
        >
          Add to PO
        </Button>,
      ] : undefined}
    >
      {/* Category Badge */}
      {renderCategoryBadge()}
      
      {/* Item Name */}
      <Title level={5} style={{ marginBottom: 4, fontSize: 16 }}>
        {item.name}
      </Title>
      
      {/* Secondary ID */}
      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>
        ID: {item.secondary_id}
      </Text>
      
      {/* Price - Large and Bold */}
      <div style={{ marginBottom: 12 }}>
        <Text strong style={{ fontSize: 24, color: '#1890ff' }}>
          {formatCurrency(item.price_usd)}
        </Text>
      </div>
      
      {/* Key Info Grid */}
      <Space direction="vertical" size="small" style={{ width: '100%', marginBottom: 12 }}>
        {/* Lead Time */}
        {item.lead_time_days !== undefined && (
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>Lead Time: </Text>
            <Text style={{ fontSize: 12 }}>{item.lead_time_days} days</Text>
          </div>
        )}
        
        {/* Stock Status */}
        {renderStockStatus()}
        
        {/* Manufacturer */}
        {item.manufacturer && (
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>Manufacturer: </Text>
            <Text style={{ fontSize: 12 }}>{item.manufacturer}</Text>
          </div>
        )}
        
        {/* Model */}
        {item.model && (
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>Model: </Text>
            <Text style={{ fontSize: 12 }}>{item.model}</Text>
          </div>
        )}
      </Space>
      
      {/* Specs Preview */}
      {item.specs && Object.keys(item.specs).length > 0 && (
        <div style={{ 
          padding: '8px', 
          background: '#fafafa', 
          borderRadius: 4,
          marginBottom: 12,
        }}>
          {getSpecsPreview()}
          {Object.keys(item.specs).length > 3 && (
            <Text type="secondary" style={{ fontSize: 11 }}>
              +{Object.keys(item.specs).length - 3} more specs
            </Text>
          )}
        </div>
      )}
      
      {/* Supplier Info */}
      {item.supplier_id && (
        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 8 }}>
          <Text type="secondary" style={{ fontSize: 11 }}>
            Supplier: {item.supplier_id}
          </Text>
        </div>
      )}
    </Card>
  );
};

export default CatalogItemCard;

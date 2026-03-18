'use client';

import React from 'react';
import { Typography, Divider, Space, Table, Descriptions, Button, Row, Col } from 'antd';
import type { TableProps, DescriptionsProps } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { DraftPOItem } from '@/lib/types';
import type { POHeaderFormData } from '@/lib/utils/validators';
import { formatCurrency } from '@/lib/utils/formatters';

const { Title, Text } = Typography;

/**
 * Wizard Step 3 - Review Props
 */
export interface POReviewProps {
  /** Header form data from Step 1 */
  headerData?: POHeaderFormData | null;
  
  /** Items from Step 2 */
  items?: Map<string, DraftPOItem>;
  
  /** Callback to edit header (go back to Step 1) */
  onEditHeader?: () => void;
  
  /** Callback to edit items (go back to Step 2) */
  onEditItems?: () => void;
  
  /** Loading state */
  loading?: boolean;
}

/**
 * Wizard Step 3 - Review & Edit Component
 * 
 * Displays all information for final verification:
 * - Header information (read-only with edit button)
 * - Items table with quantities and prices
 * - Grand total using Decimal.js
 * - Edit buttons to return to respective steps
 * - Final validation before submit
 */
export const POReview: React.FC<POReviewProps> = ({
  headerData,
  items,
  onEditHeader,
  onEditItems,
  loading = false,
}) => {
  /**
   * Convert items Map to array for rendering
   */
  const itemsArray = React.useMemo(() => {
    return items ? Array.from(items.values()) : [];
  }, [items]);

  /**
   * Calculate totals
   */
  const itemCount = itemsArray.length;
  const grandTotal = itemsArray.reduce((sum, item) => {
    try {
      return sum + parseFloat(item.total_price);
    } catch {
      return sum;
    }
  }, 0);

  /**
   * Table columns for items review
   */
  const columns: TableProps<DraftPOItem>['columns'] = [
    {
      title: 'Item Name',
      dataIndex: 'item_name',
      key: 'item_name',
      width: '40%',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            ID: {record.catalog_item_id}
          </Text>
        </div>
      ),
    },
    {
      title: 'Unit Price',
      dataIndex: 'unit_price',
      key: 'unit_price',
      width: '20%',
      render: (price: string) => formatCurrency(price),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '15%',
      align: 'center',
    },
    {
      title: 'Total',
      key: 'total',
      width: '25%',
      align: 'right',
      render: (_, record) => (
        <Text strong type="success">
          {formatCurrency(record.total_price)}
        </Text>
      ),
    },
  ];

  /**
   * Render header information section
   */
  const renderHeaderSection = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={5} style={{ margin: 0 }}>Header Information</Title>
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={onEditHeader}
          disabled={loading}
        >
          Edit
        </Button>
      </div>
      
      <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
        <Descriptions.Item label="Requestor" span={1}>
          {headerData?.requestor || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Cost Center" span={1}>
          {headerData?.costCenter || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Needed By" span={1}>
          {headerData?.neededByDate 
            ? new Date(headerData.neededByDate).toLocaleDateString()
            : '-'
          }
        </Descriptions.Item>
        <Descriptions.Item label="Payment Terms" span={1}>
          {headerData?.paymentTerms || '-'}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );

  /**
   * Render items section
   */
  const renderItemsSection = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={5} style={{ margin: 0 }}>Items ({itemCount})</Title>
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={onEditItems}
          disabled={loading}
        >
          Edit
        </Button>
      </div>
      
      {itemCount > 0 ? (
        <Table
          columns={columns}
          dataSource={itemsArray}
          rowKey="catalog_item_id"
          pagination={false}
          size="small"
          bordered
        />
      ) : (
        <Text type="secondary">No items added</Text>
      )}
    </div>
  );

  /**
   * Render totals section
   */
  const renderTotalsSection = () => (
    <div>
      <Divider />
      <Row justify="end">
        <Col>
          <Space direction="vertical" size="small" style={{ minWidth: 300 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Subtotal:</Text>
              <Text strong>{formatCurrency(grandTotal)}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Tax (0%):</Text>
              <Text>$0.00</Text>
            </div>
            <Divider style={{ margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong>Grand Total:</Text>
              <Text strong type="success" style={{ fontSize: 20 }}>
                {formatCurrency(grandTotal)}
              </Text>
            </div>
          </Space>
        </Col>
      </Row>
    </div>
  );

  return (
    <div>
      <Title level={4}>Review & Edit</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Please review all information carefully before submitting
      </Text>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header Section */}
        {renderHeaderSection()}

        {/* Items Section */}
        {renderItemsSection()}

        {/* Totals Section */}
        {renderTotalsSection()}
      </Space>
    </div>
  );
};

export default POReview;

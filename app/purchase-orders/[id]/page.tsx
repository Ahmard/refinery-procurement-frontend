'use client';

import React from 'react';
import { Typography, Card, Descriptions, Table, Button, Space, Divider, Row, Col, Tag, Spin, Alert, Empty, Timeline } from 'antd';
import type { TableProps } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined, PrinterOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import { formatCurrency } from '@/lib/utils/formatters';
import MainAppLayout from '@/components/layout/MainAppLayout';
import { usePurchaseOrder } from '@/lib/hooks/usePurchaseOrder';
import { PurchaseOrderResponse, POItemResponse } from '@/lib/api/procurement';

const { Title, Text, Paragraph } = Typography;

/**
 * Status badge color mapping
 */
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    DRAFT: 'gray',
    SUBMITTED: 'blue',
    APPROVED: 'green',
    REJECTED: 'red',
    FULFILLED: 'purple',
  };
  return colors[status] || 'default';
};

/**
 * PO Detail Page Component
 * 
 * Features:
 * - Fetch PO from API using usePurchaseOrder hook
 * - Display header info (requestor, cost center, dates, payment terms)
 * - Display items table with all line items
 * - Show totals section
 * - Status badge prominently displayed
 * - Actions based on status (Edit/Delete for Draft, View only for others)
 * - Loading and error states with retry
 * - Back button to list
 */
const PODetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  
  // Fetch PO using hook
  const { data: po, loading, error, refetch } = usePurchaseOrder(orderId);

  /**
   * Line items table columns
   */
  const columns: TableProps<POItemResponse>['columns'] = [
    {
      title: 'Item Name',
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
      align: 'right',
      render: (price: number | string) => formatCurrency(price),
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
      dataIndex: 'total_price',
      key: 'total_price',
      width: '25%',
      align: 'right',
      render: (amount: number | string) => (
        <Text strong type="success">
          {formatCurrency(amount)}
        </Text>
      ),
    },
  ];

  /**
   * Render actions based on status
   */
  const renderActions = () => {
    if (!po) return null;
    
    if (po.status === 'DRAFT') {
      return (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => router.push(`/purchase-orders/${po.id}/edit`)}>
            Edit
          </Button>
          <Button danger icon={<DeleteOutlined />}>
            Delete
          </Button>
          <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
            Print
          </Button>
        </Space>
      );
    }

    return (
      <Space>
        <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
          Print
        </Button>
      </Space>
    );
  };

  if (error) {
    return (
      <MainAppLayout>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
          <Alert
            message="Error Loading PO"
            description={error}
            type="error"
            showIcon
            action={
              <Space>
                <Button onClick={() => refetch()}>Retry</Button>
                <Button onClick={() => router.push('/purchase-orders')}>Back to List</Button>
              </Space>
            }
          />
        </div>
      </MainAppLayout>
    );
  }

  if (loading) {
    return (
      <MainAppLayout>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24, textAlign: 'center' }}>
          <Spin size="large" tip="Loading purchase order..." />
        </div>
      </MainAppLayout>
    );
  }

  if (!po) {
    return (
      <MainAppLayout>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
          <Empty description="Purchase order not found">
            <Button onClick={() => router.push('/purchase-orders')}>Back to List</Button>
          </Empty>
        </div>
      </MainAppLayout>
    );
  }

  return (
    <MainAppLayout>
      <div className="print-container" style={{ maxWidth: 1200, margin: '0 auto', padding: 24, width: '100%' }}>
        {/* Print Header - Only visible when printing */}
        <div className="print-only" style={{ display: 'none', marginBottom: 24, borderBottom: '2px solid #000', paddingBottom: 16 }}>
          <Title level={2} style={{ margin: 0 }}>{po.po_number}</Title>
          <Text>Purchase Order Detail</Text>
          <br />
          <Text>Generated: {new Date().toLocaleDateString()}</Text>
        </div>

        {/* Screen Header - Hidden when printing */}
        <div className="no-print" style={{ marginBottom: 24 }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => router.back()}
            style={{ marginBottom: 16 }}
          >
            Back to List
          </Button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <Title level={2} style={{ margin: 0 }}>{po.po_number}</Title>
              <Text type="secondary">Created {new Date(po.created_at).toLocaleDateString()}</Text>
            </div>
            
            <Tag color={getStatusColor(po.status)} style={{ fontSize: 14, padding: '4px 12px' }}>
              {po.status}
            </Tag>
          </div>
        </div>

      {/* Main Content */}
      <Row gutter={[16, 16]}>
        {/* Left Column - PO Details */}
        <Col xs={24} lg={16}>
          <Card title="Purchase Order Details" size="small" style={{ marginBottom: 16 }}>
            <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
              <Descriptions.Item label="Requestor">{po.requestor}</Descriptions.Item>
              <Descriptions.Item label="Cost Center">{po.cost_center}</Descriptions.Item>
              <Descriptions.Item label="Payment Terms">{po.payment_terms}</Descriptions.Item>
              <Descriptions.Item label="Needed By Date">
                {po.needed_by_date ? new Date(po.needed_by_date).toLocaleDateString() : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Created Date">
                {new Date(po.created_at).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {new Date(po.updated_at).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Line Items Table */}
          <Card title={`Line Items (${po.items.length})`} size="small" className="no-page-break">
            <Table
              columns={columns}
              dataSource={po.items}
              rowKey="id"
              pagination={false}
              size="small"
              bordered
              footer={() => (
                <div className="totals-section">
                  <Divider style={{ margin: 0 }} />
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text strong>Total Amount:</Text>
                      <Text strong type="success" style={{ fontSize: 18 }}>
                        {formatCurrency(po.total_amount)}
                      </Text>
                    </div>
                  </Space>
                </div>
              )}
            />
          </Card>
        </Col>

        {/* Right Column - Supplier Info & Actions */}
        <Col xs={24} lg={8}>
          <Card title="Supplier Information" size="small" style={{ marginBottom: 16 }} className="supplier-info">
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Name">{po.supplier_name}</Descriptions.Item>
              <Descriptions.Item label="ID">{po.supplier_id}</Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Actions - Hidden when printing */}
          <div className="no-print">
            <Card title="Actions" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                {renderActions()}
              </Space>
            </Card>
          </div>

          {/* Additional Info Card */}
          <Card title="Additional Information" size="small" style={{ marginTop: 16 }}>
            <Paragraph type="secondary">
              This purchase order is subject to the terms and conditions agreed upon with the supplier.
            </Paragraph>
            <Paragraph type="secondary">
              For questions or issues, contact the procurement department.
            </Paragraph>
          </Card>
          
          {/* Status History Timeline */}
          {po.status_history && po.status_history.length > 0 && (
            <Card title="Status History" size="small" style={{ marginTop: 16 }}>
              <Timeline
                items={po.status_history.map((entry, index) => ({
                  key: index,
                  color: getStatusColor(entry.status),
                  children: (
                    <div>
                      <Text strong>{entry.status}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {new Date(entry.created_at).toLocaleString()}
                      </Text>
                    </div>
                  ),
                }))}
              />
            </Card>
          )}
        </Col>
      </Row>
    </div>
  </MainAppLayout>
  );
};

export default PODetailPage;

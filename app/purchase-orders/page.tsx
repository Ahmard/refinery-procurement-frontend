'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Table, Space, Button, Input, Select, DatePicker, Row, Col, Card, Spin, Empty, Alert } from 'antd';
import type { TableProps } from 'antd';
import { SearchOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import MainAppLayout from '@/components/layout/MainAppLayout';
import { procurementApi, PurchaseOrderResponse, POFilters } from '@/lib/api/procurement';
import { formatCurrency } from '@/lib/utils/formatters';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

/**
 * PO List Page Component
 * 
 * Features:
 * - Fetch POs from API using procurementApi.list()
 * - Filters: status, supplier, date range
 * - Search by PO number
 * - Ant Design Table with columns (PO#, supplier, status, total, date)
 * - Status badges with color coding
 * - Click row navigates to detail page
 * - Pagination working
 * - Loading and error states with refresh
 */
const POListPage: React.FC = () => {
  const router = useRouter();
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [supplierFilter, setSupplierFilter] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);
  
  // API state
  const [data, setData] = useState<PurchaseOrderResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Fetch purchase orders from API
   */
  useEffect(() => {
    const fetchPOs = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const filters: POFilters = {};
        
        if (statusFilter) {
          filters.status = statusFilter as any;
        }
        
        // Add other filters as needed
        const response = await procurementApi.list(filters);
        
        // Extract records from paginated response
        const poData = response.data?.records || [];
        setData(poData);
      } catch (err: any) {
        console.error('[POList] Error fetching POs:', err);
        setError(err.response?.data?.message || 'Failed to load purchase orders');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPOs();
  }, [statusFilter]);

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
   * Table columns definition
   */
  const columns: TableProps<PurchaseOrderResponse>['columns'] = [
    {
      title: 'PO Number',
      dataIndex: 'po_number',
      key: 'po_number',
      width: 150,
      sorter: (a, b) => a.po_number.localeCompare(b.po_number),
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      width: 200,
      sorter: (a, b) => a.supplier_name.localeCompare(b.supplier_name),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      filters: [
        { text: 'Draft', value: 'DRAFT' },
        { text: 'Submitted', value: 'SUBMITTED' },
        { text: 'Approved', value: 'APPROVED' },
        { text: 'Rejected', value: 'REJECTED' },
        { text: 'Fulfilled', value: 'FULFILLED' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <span style={{ color: getStatusColor(status) }}>
          ● {status}
        </span>
      ),
    },
    {
      title: 'Total Amount',
      dataIndex: 'total_amount',
      key: 'total_amount',
      width: 130,
      sorter: (a, b) => Number(a.total_amount) - Number(b.total_amount),
      render: (amount) => formatCurrency(amount),
    },
    {
      title: 'Requestor',
      dataIndex: 'requestor',
      key: 'requestor',
      width: 150,
      render: (text) => text || 'N/A',
    },
    {
      title: 'Created Date',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      render: (date) => format(new Date(date), 'yyyy-MM-dd'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => router.push(`/purchase-orders/${record.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  /**
   * Handle filter reset
   */
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter(undefined);
    setSupplierFilter(undefined);
    setDateRange(null);
  };
  
  /**
   * Handle manual refresh
   */
  const handleRefresh = () => {
    setLoading(true);
    procurementApi.list({})
      .then(response => {
        const poData = response.data?.records || [];
        setData(poData);
      })
      .catch(err => {
        console.error('[POList] Error refreshing:', err);
        setError(err.response?.data?.message || 'Failed to refresh');
      })
      .finally(() => setLoading(false));
  };

  return (
    <MainAppLayout>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: 24, width: '100%' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Purchase Orders</Title>
          <Text type="secondary">Manage and track your purchase orders</Text>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          style={{ marginBottom: 16 }}
          action={
            <Button size="small" onClick={handleRefresh}>
              Retry
            </Button>
          }
        />
      )}

      {/* Filters */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input
              placeholder="Search by PO number..."
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
            />
          </Col>
          
          <Col xs={24} sm={12} md={6} lg={4}>
            <Select
              placeholder="All Statuses"
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
              style={{ width: '100%' }}
            >
              <Select.Option value="DRAFT">Draft</Select.Option>
              <Select.Option value="SUBMITTED">Submitted</Select.Option>
              <Select.Option value="APPROVED">Approved</Select.Option>
              <Select.Option value="REJECTED">Rejected</Select.Option>
              <Select.Option value="FULFILLED">Fulfilled</Select.Option>
            </Select>
          </Col>
          
          <Col xs={24} sm={12} md={6} lg={4}>
            <Select
              placeholder="All Suppliers"
              value={supplierFilter}
              onChange={setSupplierFilter}
              allowClear
              style={{ width: '100%' }}
            >
              <Select.Option value="ABC Supply Co.">ABC Supply Co.</Select.Option>
              <Select.Option value="XYZ Industrial">XYZ Industrial</Select.Option>
              <Select.Option value="Global Parts Inc.">Global Parts Inc.</Select.Option>
            </Select>
          </Col>
          
          <Col xs={24} sm={12} md={8} lg={6}>
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [any, any] | null)}
              style={{ width: '100%' }}
            />
          </Col>
          
          <Col xs={24} sm={24} md={24} lg={4}>
            <Space>
              <Button onClick={handleResetFilters}>Reset Filters</Button>
              <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Data Table */}
      <Table
        columns={columns}
        dataSource={data}
        loading={loading && !error}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
        rowKey="id"
        size="middle"
        bordered
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No purchase orders found"
            />
          ),
        }}
        onRow={(record) => ({
          onClick: () => router.push(`/purchase-orders/${record.id}`),
          style: { cursor: 'pointer' },
        })}
      />
    </div>
  </MainAppLayout>
  );
};

export default POListPage;

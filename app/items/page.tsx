'use client';

import React, { useState, useCallback, Suspense } from 'react';
import {
  Typography,
  Row,
  Col,
  Space,
  Button,
  Drawer,
  Select,
  Switch,
  Spin,
  Pagination,
  Modal,
  Table,
  Badge,
  Divider,
} from 'antd';
import type { RadioChangeEvent } from 'antd';
import { FilterOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import type { CatalogFilters, CatalogItemResponse } from '@/lib/types';
import { useCatalogSearch } from '@/lib/hooks/useCatalogSearch';
import { useUrlState, createStringSerializer } from '@/lib/hooks/useUrlState';
import { useDraftPO } from '@/lib/hooks/useDraftPO';
import {
  SearchBar,
  FilterPanel,
  SortDropdown,
  DataTable,
  CatalogItemCard,
  ViewToggle,
  AddToPoModal,
  SupplierConstraintAlert,
  type ViewMode,
} from '@/components/ui';
import MainAppLayout from '@/components/layout/MainAppLayout';
import { formatCurrency } from '@/lib/utils/formatters';
import { useRouter } from 'next/navigation';
import { procurementApi } from '@/lib/api/procurement';
import { v4 as uuidv4 } from 'uuid';

const { Title, Text } = Typography;

interface CatalogPageState {
  search: string;
  category: string;
  in_stock?: boolean;
  sort_by: string;
  sort_order: 'asc' | 'desc';
  page: number;
  page_size: number;
  view_mode: ViewMode;
}

const INITIAL_STATE: CatalogPageState = {
  search: '',
  category: '',
  in_stock: undefined,
  sort_by: 'price',
  sort_order: 'asc',
  page: 1,
  page_size: 20,
  view_mode: 'grid',
};

const CatalogPageContent: React.FC = () => {
  const router = useRouter();
  const urlState = useUrlState<CatalogPageState>(INITIAL_STATE, {
    serialize: (state) => {
      const result: Record<string, string> = {};
      if (state.search) result.search = state.search;
      if (state.category) result.category = state.category;
      if (state.in_stock !== undefined)
        result.in_stock = String(state.in_stock);
      if (state.sort_by) result.sort_by = state.sort_by;
      if (state.sort_order) result.sort_order = state.sort_order;
      if (state.page) result.page = String(state.page);
      if (state.page_size) result.page_size = String(state.page_size);
      if (state.view_mode) result.view_mode = state.view_mode;
      return result;
    },
    deserialize: (params) => {
      const result: Partial<CatalogPageState> = {};
      if (params.search) result.search = params.search;
      if (params.category) result.category = params.category;
      if (params.in_stock) result.in_stock = params.in_stock === 'true';
      if (params.sort_by) result.sort_by = params.sort_by;
      if (params.sort_order)
        result.sort_order = params.sort_order as 'asc' | 'desc';
      if (params.page) result.page = Number(params.page);
      if (params.page_size) result.page_size = Number(params.page_size);
      if (params.view_mode)
        result.view_mode = params.view_mode as ViewMode;
      return result;
    },
  });

  const {
    addItem,
    supplierId,
    supplierName,
    itemCount,
    itemsArray,
    removeItem,
    clearDraft,
    header,
  } = useDraftPO();

  const [addToPoModalVisible, setAddToPoModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<CatalogItemResponse | null>(null);
  const [supplierMismatchError, setSupplierMismatchError] = useState<{
    current: string;
    attempted: string;
  } | null>(null);
  const [draftPreviewVisible, setDraftPreviewVisible] = useState(false);
  const [mobileFilterVisible, setMobileFilterVisible] = useState(false);

  const filters: CatalogFilters = {
    search: urlState.state.search || undefined,
    category: urlState.state.category || undefined,
    in_stock: urlState.state.in_stock ? true : undefined,
    sort_by: urlState.state.sort_by as
      | 'price'
      | 'lead_time'
      | 'name'
      | 'supplier'
      | undefined,
    sort_order: urlState.state.sort_order || 'asc',
    page: urlState.state.page,
    page_size: urlState.state.page_size,
  };

  const { data, isLoading, error, refetch } = useCatalogSearch(filters);

  const handleSearch = useCallback(
    (value: string) => {
      urlState.setState({ search: value, page: 1 });
    },
    [urlState]
  );

  const handleCategoryChange = useCallback(
    (value: string) => {
      urlState.setState({ category: value, page: 1 });
    },
    [urlState]
  );

  const handleInStockChange = useCallback(
    (checked: boolean) => {
      urlState.setState({ in_stock: checked ? true : undefined, page: 1 });
    },
    [urlState]
  );

  const handleSortChange = useCallback(
    (value: string) => {
      const [sort_by, sort_order] = value.split('_') as [
        string,
        'asc' | 'desc'
      ];
      urlState.setState({ sort_by, sort_order, page: 1 });
    },
    [urlState]
  );

  const handlePageChange = useCallback(
    (page: number, pageSize: number) => {
      urlState.setState({ page, page_size: pageSize });
    },
    [urlState]
  );

  const handleViewModeChange = useCallback(
    (mode: ViewMode) => {
      urlState.setState({ view_mode: mode });
    },
    [urlState]
  );

  const handleReset = useCallback(() => {
    urlState.resetState();
  }, [urlState]);

  const handleAddToPo = useCallback(
    (item: CatalogItemResponse) => {
      setSelectedItem(item);
      setAddToPoModalVisible(true);
      setSupplierMismatchError(null);
    },
    []
  );

  const handleModalConfirm = useCallback(
    (quantity: number) => {
      if (!selectedItem) return;

      const draftPOItem = {
        catalog_item_id: selectedItem.id,
        item_name: selectedItem.name,
        unit_price: selectedItem.price_usd,
        quantity,
        total_price: (
          parseFloat(String(selectedItem.price_usd)) * quantity
        ).toString(),
        supplier_id: selectedItem.supplier_id,
        supplier_name: selectedItem.supplier_id,
      };

      const result = addItem(
        draftPOItem,
        selectedItem.supplier_id,
        selectedItem.supplier_id
      );

      if (result.ok) {
        setAddToPoModalVisible(false);
        setSelectedItem(null);
      } else {
        setSupplierMismatchError({
          current: supplierName || 'Current PO',
          attempted: result.error.includes('supplier')
            ? selectedItem.supplier_id
            : 'Unknown',
        });
      }
    },
    [selectedItem, addItem, supplierName]
  );

  const handleRemoveItem = useCallback(
    (catalogItemId: string) => {
      removeItem(catalogItemId);
    },
    [removeItem]
  );

  const handleOpenDraftPreview = useCallback(() => {
    setDraftPreviewVisible(true);
  }, []);
  
  const handleCreatePO = useCallback(async () => {
    let createLoading: any = null;
    let addItemLoading: any = null;
    let submitLoading: any = null;

    try {
      if (!supplierId || itemsArray.length === 0) {
        Modal.error({
          title: 'Cannot Create Purchase Order',
          content: 'Please add at least one item to create a purchase order.',
        });
        return;
      }

      console.log('[CatalogPage] Starting PO creation process...');

      const authToken =
        typeof window !== 'undefined'
          ? localStorage.getItem('auth_token')
          : null;
      if (!authToken) {
        Modal.error({
          title: 'Authentication Required',
          content: 'Please log in to create a purchase order.',
          onOk: () => router.push('/login'),
        });
        return;
      }

      console.log(
        '[CatalogPage] Auth token found:',
        authToken.substring(0, 8) + '...'
      );

      createLoading = Modal.confirm({
        title: 'Creating Purchase Order...',
        content: 'Step 1 of 3: Creating draft purchase order...',
        footer: null,
        closable: false,
      });

      const idempotencyKey = uuidv4();
      const payload = {
        supplier_id: supplierId,
        requestor: header?.requestor,
        cost_center: header?.cost_center,
        payment_terms: header?.payment_terms,
        needed_by_date: header?.needed_by_date,
      };

      console.log('[CatalogPage] Creating PO with payload:', payload);
      console.log('[CatalogPage] Idempotency Key:', idempotencyKey);

      const createResponse = await procurementApi.createDraft(
        payload,
        idempotencyKey
      );

      const poId = createResponse.data.id;
      console.log('[CatalogPage] Draft PO created:', poId);

      createLoading.destroy();

      addItemLoading = Modal.confirm({
        title: 'Adding Items...',
        content: `Step 2 of 3: Adding ${itemsArray.length} items to purchase order...`,
        footer: null,
        closable: false,
      });

      for (const item of itemsArray) {
        await procurementApi.addItem(poId, {
          item_id: item.catalog_item_id,
          quantity: item.quantity,
        });
        console.log(`[CatalogPage] Added item ${item.catalog_item_id} to PO`);
      }

      addItemLoading.destroy();

      submitLoading = Modal.confirm({
        title: 'Submitting Purchase Order...',
        content: 'Step 3 of 3: Submitting purchase order for approval...',
        footer: null,
        closable: false,
      });

      await procurementApi.submitOrder(poId);
      console.log('[CatalogPage] PO submitted successfully');

      submitLoading.destroy();

      Modal.success({
        title: 'Purchase Order Created & Submitted!',
        content: (
          <div>
            <p>Your purchase order has been created and submitted successfully.</p>
            <p>
              <strong>PO Number:</strong>{' '}
              {createResponse.data.po_number}
            </p>
            <p>
              <strong>Total Amount:</strong>{' '}
              {formatCurrency(createResponse.data.total_amount)}
            </p>
          </div>
        ),
        onOk: () => {
          clearDraft();
          router.push('/purchase-orders');
        },
      });
    } catch (error: any) {
      console.error('[CatalogPage] Error creating PO:', error);

      if (createLoading) createLoading.destroy();
      if (addItemLoading) addItemLoading.destroy();
      if (submitLoading) submitLoading.destroy();

      let errorMessage = 'Failed to create purchase order. Please try again.';

      if (error.response?.status === 409) {
        errorMessage =
          'Supplier mismatch detected. All items must be from the same supplier.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || 'Invalid data provided.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
      }

      Modal.error({
        title: 'Error Creating Purchase Order',
        content: errorMessage,
      });
    }
  }, [clearDraft, supplierId, itemsArray, header]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Secondary ID',
      dataIndex: 'secondary_id',
      key: 'secondary_id',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Price (USD)',
      dataIndex: 'price_usd',
      key: 'price',
      sorter: true,
      render: (price: string) => `$${Number(price).toFixed(2)}`,
    },
    {
      title: 'Lead Time',
      dataIndex: 'lead_time_days',
      key: 'lead_time',
      sorter: true,
      render: (days?: number) => (days ? `${days} days` : 'N/A'),
    },
    {
      title: 'In Stock',
      dataIndex: 'in_stock',
      key: 'in_stock',
      render: (inStock?: boolean) => (
        <Text type={inStock ? 'success' : 'secondary'}>
          {inStock ? '✓ In Stock' : '○ Out of Stock'}
        </Text>
      ),
    },
  ];

  return (
    <MainAppLayout>
      <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%' }}>
        <div
          style={{
            marginBottom: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <Title level={2}>Catalog</Title>
            <Text type="secondary">Browse and search industrial products</Text>
          </div>
          <Space direction="horizontal" size="middle">
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              onClick={handleOpenDraftPreview}
              size="large"
              disabled={itemCount === 0}
            >
              Draft PO ({itemCount})
            </Button>
            <ViewToggle
              value={urlState.state.view_mode}
              onChange={handleViewModeChange}
            />
          </Space>
        </div>

        <div className="desktop-only" style={{ display: 'none' }}>
          <FilterPanel
            title="Filters"
            extra={
              <Button onClick={handleReset} size="small">
                Reset Filters
              </Button>
            }
          >
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12} md={8} lg={6}>
                <SearchBar
                  placeholder="Search products..."
                  value={urlState.state.search}
                  onSearch={handleSearch}
                  loading={isLoading}
                  allowClear
                />
              </Col>

              <Col xs={24} sm={12} md={6} lg={4}>
                <Select
                  placeholder="All Categories"
                  value={urlState.state.category || undefined}
                  onChange={handleCategoryChange}
                  allowClear
                  style={{ width: '100%' }}
                >
                  <Select.Option value="PUMPS">Pumps</Select.Option>
                  <Select.Option value="VALVES">Valves</Select.Option>
                  <Select.Option value="FITTINGS">Fittings</Select.Option>
                  <Select.Option value="TUBING">Tubing</Select.Option>
                  <Select.Option value="INSTRUMENTATION">
                    Instrumentation
                  </Select.Option>
                  <Select.Option value="ELECTRICAL">Electrical</Select.Option>
                  <Select.Option value="MECHANICAL">Mechanical</Select.Option>
                  <Select.Option value="SAFETY">Safety</Select.Option>
                  <Select.Option value="OTHER">Other</Select.Option>
                </Select>
              </Col>

              <Col xs={24} sm={12} md={6} lg={4}>
                <Switch
                  checked={!!urlState.state.in_stock}
                  onChange={handleInStockChange}
                  checkedChildren="In Stock"
                  unCheckedChildren="All Items"
                />
              </Col>

              <Col xs={24} sm={12} md={6} lg={5}>
                <SortDropdown
                  value={`${urlState.state.sort_by}_${urlState.state.sort_order}`}
                  onChange={handleSortChange}
                />
              </Col>
            </Row>
          </FilterPanel>
        </div>

        <div className="mobile-only" style={{ marginBottom: 16 }}>
          <Space style={{ width: '100%' }}>
            <Button
              icon={<FilterOutlined />}
              onClick={() => setMobileFilterVisible(true)}
              block
            >
              Filters
            </Button>
            <SortDropdown
              value={`${urlState.state.sort_by}_${urlState.state.sort_order}`}
              onChange={handleSortChange}
            />
          </Space>
        </div>

        <Drawer
          title="Filters"
          placement="right"
          onClose={() => setMobileFilterVisible(false)}
          open={mobileFilterVisible}
          width="100%"
        >
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div>
              <Text strong>Search</Text>
              <SearchBar
                placeholder="Search products..."
                value={urlState.state.search}
                onSearch={(value) => {
                  handleSearch(value);
                  setMobileFilterVisible(false);
                }}
                loading={isLoading}
                style={{ marginTop: 8 }}
                allowClear
              />
            </div>

            <div>
              <Text strong>Category</Text>
              <Select
                placeholder="All Categories"
                value={urlState.state.category || undefined}
                onChange={(value) => {
                  handleCategoryChange(value);
                  setMobileFilterVisible(false);
                }}
                allowClear
                style={{ width: '100%', marginTop: 8 }}
              >
                <Select.Option value="PUMPS">Pumps</Select.Option>
                <Select.Option value="VALVES">Valves</Select.Option>
                <Select.Option value="FITTINGS">Fittings</Select.Option>
                <Select.Option value="TUBING">Tubing</Select.Option>
                <Select.Option value="INSTRUMENTATION">
                  Instrumentation
                </Select.Option>
                <Select.Option value="ELECTRICAL">Electrical</Select.Option>
                <Select.Option value="MECHANICAL">Mechanical</Select.Option>
                <Select.Option value="SAFETY">Safety</Select.Option>
                <Select.Option value="OTHER">Other</Select.Option>
              </Select>
            </div>

            <div>
              <Text strong>Availability</Text>
              <div style={{ marginTop: 8 }}>
                <Switch
                  checked={!!urlState.state.in_stock}
                  onChange={handleInStockChange}
                  checkedChildren="In Stock Only"
                  unCheckedChildren="All Items"
                />
              </div>
            </div>

            <Button onClick={handleReset} block>
              Reset All Filters
            </Button>
          </Space>
        </Drawer>

        {urlState.state.view_mode === 'list' ? (
          <DataTable
            data={data?.items || []}
            columns={columns}
            loading={isLoading}
            error={error?.message}
            emptyMessage="No catalog items found"
            emptyDescription="Try adjusting your search or filters"
            pagination={{
              current: data?.page,
              pageSize: data?.page_size,
              total: data?.total,
              onChange: handlePageChange,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
            sortable
            rowKey="id"
          />
        ) : (
          <div>
            <Row gutter={[16, 16]}>
              {(data?.items || []).map((item: any) => (
                <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                  <CatalogItemCard
                    item={item}
                    showAddToPo
                    onAddToPo={handleAddToPo}
                  />
                </Col>
              ))}
            </Row>

            {(data?.total || 0) > 0 && (
              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <Pagination
                  current={data?.page}
                  pageSize={data?.page_size}
                  total={data?.total}
                  onChange={handlePageChange}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`
                  }
                />
              </div>
            )}
          </div>
        )}
      </div>

      <AddToPoModal
        open={addToPoModalVisible}
        item={selectedItem}
        onConfirm={handleModalConfirm}
        onCancel={() => {
          setAddToPoModalVisible(false);
          setSelectedItem(null);
          setSupplierMismatchError(null);
        }}
      />

      {supplierMismatchError && (
        <Modal
          open={!!supplierMismatchError}
          onCancel={() => setSupplierMismatchError(null)}
          footer={null}
          width={500}
        >
          <SupplierConstraintAlert
            currentSupplierName={supplierMismatchError.current}
            attemptedSupplierName={supplierMismatchError.attempted}
            title="Cannot Add Items from Multiple Suppliers"
          />
        </Modal>
      )}

      <Modal
        open={draftPreviewVisible}
        onCancel={() => setDraftPreviewVisible(false)}
        title={
          <div>
            <ShoppingCartOutlined /> Draft Purchase Order
            {supplierName && (
              <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
                Supplier: {supplierName}
              </Text>
            )}
          </div>
        }
        width={800}
        footer={
          itemsArray.length > 0 ? (
            <Space style={{ justifyContent: 'space-between' }}>
              <Button danger onClick={() => clearDraft()}>
                Clear Draft
              </Button>
              <Space>
                <Button onClick={() => setDraftPreviewVisible(false)}>
                  Continue Shopping
                </Button>
                <Button
                  type="primary"
                  onClick={handleCreatePO}
                  disabled={!supplierId || itemsArray.length === 0}
                >
                  Create & Submit Purchase Order
                </Button>
              </Space>
            </Space>
          ) : null
        }
      >
        {itemsArray.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Text type="secondary">No items in draft PO</Text>
          </div>
        ) : (
          <Table
            columns={[
              {
                title: 'Item Name',
                dataIndex: 'item_name',
                key: 'item_name',
                width: '35%',
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
                width: '15%',
                align: 'right',
                render: (price: string) => formatCurrency(price),
              },
              {
                title: 'Quantity',
                dataIndex: 'quantity',
                key: 'quantity',
                width: '12%',
                align: 'center',
              },
              {
                title: 'Total',
                dataIndex: 'total_price',
                key: 'total_price',
                width: '18%',
                align: 'right',
                render: (amount: string) => (
                  <Text strong type="success">
                    {formatCurrency(amount)}
                  </Text>
                ),
              },
              {
                title: 'Actions',
                key: 'actions',
                width: '20%',
                align: 'right',
                render: (_: any, record: any) => (
                  <Button
                    type="link"
                    danger
                    onClick={() => handleRemoveItem(record.catalog_item_id)}
                  >
                    Remove
                  </Button>
                ),
              },
            ]}
            dataSource={itemsArray}
            rowKey="catalog_item_id"
            pagination={false}
            size="small"
            footer={() => (
              <div style={{ textAlign: 'right' }}>
                <Divider style={{ margin: '8px 0' }} />
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Total Items:</Text>
                    <Text strong>{itemCount}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>Total Amount:</Text>
                    <Text strong type="success" style={{ fontSize: 18 }}>
                      {formatCurrency(
                        itemsArray.reduce(
                          (sum, item) => sum + parseFloat(item.total_price),
                          0
                        )
                      )}
                    </Text>
                  </div>
                </Space>
              </div>
            )}
          />
        )}
      </Modal>
    </MainAppLayout>
  );
};

const CatalogPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Spin size="large" />
        </div>
      }
    >
      <CatalogPageContent />
    </Suspense>
  );
};

export default CatalogPage;

'use client';

import React from 'react';
import { Table, Spin, Empty, Alert, Typography } from 'antd';
import type { TableProps, TablePaginationConfig } from 'antd/es/table';
import { cn } from '@/lib/utils/helpers';

const { Text } = Typography;

/**
 * DataTable Props Interface
 * Generic component that works with any data type T
 */
export interface DataTableProps<T extends object> extends Omit<TableProps<T>, 'dataSource' | 'columns' | 'pagination' | 'rowSelection'> {
  /** Data to display in the table */
  data: T[];
  
  /** Column definitions */
  columns: TableProps<T>['columns'];
  
  /** Loading state */
  loading?: boolean;
  
  /** Error message (shows error state) */
  error?: string | null;
  
  /** Empty state message */
  emptyMessage?: string;
  
  /** Custom empty state description */
  emptyDescription?: string;
  
  /** Enable row selection with checkboxes */
  rowSelection?: boolean | TableProps<T>['rowSelection'];
  
  /** Enable sortable columns */
  sortable?: boolean;
  
  /** Pagination configuration */
  pagination?: boolean | TablePaginationConfig;
  
  /** Custom className */
  className?: string;
  
  /** Row key extractor (defaults to 'id' or 'key' property) */
  rowKey?: string | ((record: T) => string);
}

/**
 * Default empty state content
 */
const DefaultEmpty: React.FC<{ message?: string; description?: string }> = ({ 
  message = 'No data available',
  description 
}) => (
  <Empty 
    description={
      <div style={{ textAlign: 'center' }}>
        {description && <Text type="secondary">{description}</Text>}
        {!description && <Text type="secondary">{message}</Text>}
      </div>
    }
  />
);

/**
 * Loading overlay component
 */
const LoadingOverlay: React.FC = () => (
  <div
    style={{
      minHeight: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Spin size="large" tip="Loading..." />
  </div>
);

/**
 * Error state component
 */
const ErrorState: React.FC<{ message: string; onRetry?: () => void }> = ({ 
  message,
  onRetry 
}) => (
  <Alert
    type="error"
    message="Error loading data"
    description={message}
    showIcon
    action={
      onRetry && (
        <a onClick={onRetry} style={{ color: '#1890ff' }}>
          Retry
        </a>
      )
    }
  />
);

/**
 * DataTable - Reusable Table Component
 * 
 * A wrapper around Ant Design Table with:
 * - Generic typing for type safety
 * - Built-in loading, empty, and error states
 * - Pagination integration
 * - Sortable columns support
 * - Row selection (checkboxes)
 * - Consistent styling
 * 
 * @template T - The type of data items
 */
export function DataTable<T extends object>({
  data,
  columns,
  loading = false,
  error = null,
  emptyMessage = 'No data available',
  emptyDescription,
  rowSelection = false,
  sortable = false,
  pagination = true,
  className,
  rowKey = 'id',
  ...tableProps
}: DataTableProps<T>) {
  /**
   * Resolve row key
   */
  const resolveRowKey = React.useCallback((record: T): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    
    // Try common key properties
    const recordAny = record as any;
    return recordAny[rowKey] || recordAny.id || recordAny.key || String(Math.random());
  }, [rowKey]);

  /**
   * Enhance columns with sorting if enabled
   */
  const enhancedColumns = React.useMemo(() => {
    if (!sortable || !columns) return columns;
    
    return columns.map((col: any) => {
      if (col.sorter) {
        return col; // Already has sorter
      }
      
      // Check if column should be sortable (default for text columns)
      if (col.dataIndex && !col.sorter) {
        return {
          ...col,
          sorter: (a: any, b: any) => {
            const aVal = a[col.dataIndex as string];
            const bVal = b[col.dataIndex as string];
            
            if (typeof aVal === 'string' && typeof bVal === 'string') {
              return aVal.localeCompare(bVal);
            }
            
            if (typeof aVal === 'number' && typeof bVal === 'number') {
              return aVal - bVal;
            }
            
            return 0;
          },
        };
      }
      
      return col;
    });
  }, [columns, sortable]);

  /**
   * Configure row selection
   */
  const selectionConfig = React.useMemo(() => {
    if (!rowSelection) return undefined;
    
    if (typeof rowSelection === 'object') {
      return rowSelection;
    }
    
    // Default checkbox selection
    return {
      type: 'checkbox' as const,
    };
  }, [rowSelection]);

  /**
   * Configure pagination
   */
  const paginationConfig = React.useMemo(() => {
    if (!pagination) return false;
    
    if (typeof pagination === 'object') {
      return pagination;
    }
    
    // Default pagination
    return {
      pageSize: 10,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total: number, range: [number, number]) => 
        `${range[0]}-${range[1]} of ${total} items`,
      pageSizeOptions: ['10', '20', '50', '100'],
    };
  }, [pagination]);

  /**
   * Render error state
   */
  if (error) {
    return <ErrorState message={error} />;
  }

  /**
   * Render loading state
   */
  if (loading) {
    return <LoadingOverlay />;
  }

  /**
   * Render empty state
   */
  if (!data || data.length === 0) {
    return (
      <div
        className={cn('datatable-empty', className)}
        style={{
          padding: '48px 16px',
          textAlign: 'center',
          background: '#fafafa',
          borderRadius: 4,
        }}
      >
        <DefaultEmpty message={emptyMessage} description={emptyDescription} />
      </div>
    );
  }

  /**
   * Render the table
   */
  return (
    <Table<T>
      dataSource={data}
      columns={enhancedColumns}
      loading={loading}
      rowKey={resolveRowKey}
      rowSelection={selectionConfig}
      pagination={paginationConfig}
      className={cn('datatable', className)}
      {...tableProps}
    />
  );
}

/**
 * Default props
 */
DataTable.defaultProps = {
  loading: false,
  error: null,
  emptyMessage: 'No data available',
  rowSelection: false,
  sortable: false,
  pagination: true,
};

export default DataTable;

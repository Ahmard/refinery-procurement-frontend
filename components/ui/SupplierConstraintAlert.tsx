'use client';

import React from 'react';
import { Alert, Typography, Space } from 'antd';
import type { AlertProps } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

/**
 * SupplierConstraintAlert Props
 */
export interface SupplierConstraintAlertProps extends Omit<AlertProps, 'type' | 'message'> {
  /** Name of the supplier already in the PO */
  currentSupplierName?: string;
  
  /** Name of the supplier being attempted to add */
  attemptedSupplierName?: string;
  
  /** Custom title */
  title?: string;
  
  /** Show detailed explanation */
  showExplanation?: boolean;
}

/**
 * Supplier Constraint Alert Component
 * 
 * Displays clear error messaging when attempting to add items from multiple suppliers
 * to a single purchase order draft.
 * 
 * Features:
 * - Clear error message about supplier constraint
 * - Shows current PO supplier name vs attempted supplier name
 * - Helpful explanation text
 * - Actionable guidance for user
 */
export const SupplierConstraintAlert: React.FC<SupplierConstraintAlertProps> = ({
  currentSupplierName,
  attemptedSupplierName,
  title = 'Cannot Add Items from Multiple Suppliers',
  showExplanation = true,
  ...alertProps
}) => {
  return (
    <Alert
      type="error"
      showIcon
      icon={<CloseCircleOutlined />}
      message={
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Title level={5} style={{ margin: 0, color: '#ff4d4f' }}>
            {title}
          </Title>
          
          {(currentSupplierName || attemptedSupplierName) && (
            <div style={{ marginTop: 8 }}>
              {currentSupplierName && (
                <Paragraph style={{ margin: 0 }}>
                  <Text strong>Current PO Supplier:</Text>{' '}
                  <Text type="success" strong>{currentSupplierName}</Text>
                </Paragraph>
              )}
              
              {attemptedSupplierName && (
                <Paragraph style={{ margin: 0 }}>
                  <Text strong>Attempted Addition:</Text>{' '}
                  <Text type="danger" strong>{attemptedSupplierName}</Text>
                </Paragraph>
              )}
            </div>
          )}
          
          {showExplanation && (
            <Paragraph style={{ margin: 0, fontSize: 13 }} type="secondary">
              Each purchase order can only contain items from a single supplier. 
              The first item added to a draft PO locks the supplier for that order. 
              To add items from a different supplier, please create a separate purchase order 
              or remove the current items and start a new draft.
            </Paragraph>
          )}
        </Space>
      }
      {...alertProps}
    />
  );
};

export default SupplierConstraintAlert;

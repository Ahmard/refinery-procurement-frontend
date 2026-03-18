'use client';

import React from 'react';
import { Badge } from 'antd';
import type { BadgeProps } from 'antd';

/**
 * Purchase Order status types
 */
export type PurchaseOrderStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'FULFILLED';

/**
 * Status Badge Props
 */
export interface StatusBadgeProps extends Omit<BadgeProps, 'status' | 'text'> {
  /** PO status value */
  status: PurchaseOrderStatus;
  
  /** Optional text label next to badge */
  text?: string;
  
  /** Whether to show full label or just status */
  showLabel?: boolean;
}

/**
 * Status color mapping
 */
const STATUS_COLORS: Record<PurchaseOrderStatus, string> = {
  DRAFT: 'gray',
  SUBMITTED: 'blue',
  APPROVED: 'green',
  REJECTED: 'red',
  FULFILLED: 'purple',
};

/**
 * Status label mapping
 */
const STATUS_LABELS: Record<PurchaseOrderStatus, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  FULFILLED: 'Fulfilled',
};

/**
 * Get color for status
 */
const getStatusColor = (status: PurchaseOrderStatus): string => {
  return STATUS_COLORS[status];
};

/**
 * Get label for status
 */
const getStatusLabel = (status: PurchaseOrderStatus): string => {
  return STATUS_LABELS[status];
};

/**
 * Status Badge Component
 * 
 * Reusable status badge with color coding:
 * - Color mapping: DRAFT=gray, SUBMITTED=blue, APPROVED=green, REJECTED=red, FULFILLED=purple
 * - Ant Design Badge component usage
 * - Consistent styling across app
 * - Used in PO list and detail pages
 * - Accessible (ARIA labels)
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  text,
  showLabel = true,
  ...badgeProps
}) => {
  const color = getStatusColor(status);
  const label = getStatusLabel(status);
  const displayText = text || (showLabel ? label : '');

  return (
    <Badge
      color={color}
      text={displayText}
      {...badgeProps}
      style={{
        ...badgeProps.style,
        whiteSpace: 'nowrap',
      }}
    />
  );
};

export default StatusBadge;

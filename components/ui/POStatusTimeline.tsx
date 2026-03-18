'use client';

import React from 'react';
import { Typography, Timeline, Tag } from 'antd';
import type { TimelineProps } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, StarOutlined } from '@ant-design/icons';
import { format } from 'date-fns';

const { Title, Text } = Typography;

/**
 * PO Status types
 */
export type POStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'FULFILLED';

/**
 * Status timeline entry
 */
export interface StatusTimelineEntry {
  status: POStatus;
  timestamp: string;
  user?: string;
  comment?: string;
}

/**
 * PO Status Timeline Props
 */
export interface POStatusTimelineProps {
  /** Array of status changes in chronological order */
  statusHistory?: StatusTimelineEntry[];
  
  /** Current status (will be highlighted) */
  currentStatus?: POStatus;
  
  /** Whether to show vertical or horizontal layout */
  mode?: 'vertical' | 'horizontal';
  
  /** Custom title */
  title?: string;
}

/**
 * Status configuration
 */
const STATUS_CONFIG: Record<POStatus, { color: string; icon: React.ReactNode; label: string }> = {
  DRAFT: {
    color: 'gray',
    icon: <ClockCircleOutlined />,
    label: 'Draft',
  },
  SUBMITTED: {
    color: 'blue',
    icon: <ClockCircleOutlined />,
    label: 'Submitted',
  },
  APPROVED: {
    color: 'green',
    icon: <CheckCircleOutlined />,
    label: 'Approved',
  },
  REJECTED: {
    color: 'red',
    icon: <CloseCircleOutlined />,
    label: 'Rejected',
  },
  FULFILLED: {
    color: 'purple',
    icon: <StarOutlined />,
    label: 'Fulfilled',
  },
};

/**
 * Get status color
 */
const getStatusColor = (status: POStatus): string => {
  return STATUS_CONFIG[status].color;
};

/**
 * Format timestamp
 */
const formatTimestamp = (timestamp: string): string => {
  try {
    return format(new Date(timestamp), 'MMM dd, yyyy HH:mm');
  } catch {
    return timestamp;
  }
};

/**
 * PO Status Timeline Component
 * 
 * Visual timeline showing PO status history:
 * - Uses Ant Design Timeline component
 * - Shows all status changes: DRAFT → SUBMITTED → APPROVED/REJECTED → FULFILLED
 * - Each node displays: status, timestamp, user
 * - Current status highlighted (color, bold)
 * - Past statuses grayed out
 * - Future statuses faded
 * - Vertical or horizontal layout
 */
export const POStatusTimeline: React.FC<POStatusTimelineProps> = ({
  statusHistory = [],
  currentStatus,
  mode = 'vertical',
  title = 'Status History',
}) => {
  /**
   * Determine if a status is in the past
   */
  const isPastStatus = (status: POStatus): boolean => {
    if (!currentStatus) return false;
    
    const statusOrder: POStatus[] = ['DRAFT', 'SUBMITTED', 'APPROVED', 'FULFILLED'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const checkIndex = statusOrder.indexOf(status);
    
    // Special handling for REJECTED
    if (currentStatus === 'REJECTED') {
      return status === 'SUBMITTED' || status === 'DRAFT';
    }
    
    return checkIndex < currentIndex;
  };

  /**
   * Determine if a status is current
   */
  const isCurrentStatus = (status: POStatus): boolean => {
    return status === currentStatus;
  };

  /**
   * Determine if a status is in the future
   */
  const isFutureStatus = (status: POStatus): boolean => {
    return !isPastStatus(status) && !isCurrentStatus(status);
  };

  /**
   * Get entry style based on status state
   */
  const getEntryStyle = (status: POStatus): React.CSSProperties => {
    if (isCurrentStatus(status)) {
      return { fontWeight: 'bold', fontSize: '15px' };
    }
    if (isFutureStatus(status)) {
      return { opacity: 0.4 };
    }
    return { opacity: 0.65 };
  };

  /**
   * Build timeline items
   */
  const timelineItems: TimelineProps['items'] = statusHistory.map((entry, index) => {
    const isLast = index === statusHistory.length - 1;
    const isCurrent = isCurrentStatus(entry.status);
    
    return {
      key: entry.timestamp + entry.status,
      color: getStatusColor(entry.status),
      dot: (
        <span style={{ fontSize: 16 }}>
          {STATUS_CONFIG[entry.status].icon}
        </span>
      ),
      children: (
        <div style={getEntryStyle(entry.status)}>
          <div style={{ marginBottom: 4 }}>
            <Tag color={getStatusColor(entry.status)}>
              {STATUS_CONFIG[entry.status].label}
            </Tag>
          </div>
          
          <div style={{ marginBottom: 4 }}>
            <Text strong>{formatTimestamp(entry.timestamp)}</Text>
          </div>
          
          {entry.user && (
            <div style={{ marginBottom: 4 }}>
              <Text type="secondary">By: {entry.user}</Text>
            </div>
          )}
          
          {entry.comment && (
            <div>
              <Text italic type="secondary">{entry.comment}</Text>
            </div>
          )}
        </div>
      ),
    };
  });

  return (
    <div>
      {title && (
        <Title level={5} style={{ marginBottom: 16 }}>
          {title}
        </Title>
      )}
      
      <Timeline
        mode={mode === 'horizontal' ? 'alternate' : undefined}
        items={timelineItems}
        pending={
          !currentStatus || !['FULFILLED', 'REJECTED'].includes(currentStatus)
            ? 'Pending next status...'
            : undefined
        }
        pendingDot={
          <ClockCircleOutlined style={{ color: '#999' }} />
        }
      />
    </div>
  );
};

export default POStatusTimeline;

'use client';

import React from 'react';
import { Card, Space } from 'antd';
import type { CardProps } from 'antd';

/**
 * FilterPanel Props Interface
 */
export interface FilterPanelProps extends CardProps {
  /** Filter controls children */
  children: React.ReactNode;
  
  /** Title for the filter panel */
  title?: string;
  
  /** Extra actions (e.g., reset filters button) */
  extra?: React.ReactNode;
}

/**
 * FilterPanel Component
 * 
 * A wrapper component for filter controls with consistent styling.
 * Provides a clean container for search bars, dropdowns, and other filter inputs.
 */
export const FilterPanel: React.FC<FilterPanelProps> = ({
  children,
  title,
  extra,
  size = 'small',
  ...cardProps
}) => {
  return (
    <Card
      size={size}
      title={title}
      extra={extra}
      style={{ marginBottom: 16, ...cardProps.style }}
      className="filter-panel"
      {...cardProps}
    >
      <Space wrap size="middle" style={{ width: '100%' }}>
        {children}
      </Space>
    </Card>
  );
};

export default FilterPanel;

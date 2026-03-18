'use client';

import React from 'react';
import { Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';

/**
 * View mode type
 */
export type ViewMode = 'grid' | 'list';

/**
 * ViewToggle Props
 */
export interface ViewToggleProps {
  /** Current view mode */
  value?: ViewMode;
  
  /** Callback when view mode changes */
  onChange?: (mode: ViewMode) => void;
  
  /** Custom className */
  className?: string;
}

/**
 * ViewToggle Component
 * 
 * Toggle between grid and list view modes.
 * Used in catalog pages to switch display layouts.
 */
export const ViewToggle: React.FC<ViewToggleProps> = ({
  value = 'grid',
  onChange,
  className,
}) => {
  const handleChange = (e: RadioChangeEvent) => {
    onChange?.(e.target.value);
  };

  return (
    <Radio.Group 
      value={value} 
      onChange={handleChange}
      className={className}
      buttonStyle="solid"
    >
      <Radio.Button value="grid">
        <AppstoreOutlined /> Grid
      </Radio.Button>
      <Radio.Button value="list">
        <UnorderedListOutlined /> List
      </Radio.Button>
    </Radio.Group>
  );
};

export default ViewToggle;

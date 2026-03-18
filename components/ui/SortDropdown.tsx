'use client';

import React from 'react';
import { Select } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import type { SelectProps } from 'antd';

/**
 * Sort option configuration
 */
export interface SortOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export const DEFAULT_SORT_OPTIONS: SortOption[] = [
  { value: 'price_asc', label: 'Price: Low to High', icon: <ArrowUpOutlined /> },
  { value: 'price_desc', label: 'Price: High to Low', icon: <ArrowDownOutlined /> },
  { value: 'lead_time_asc', label: 'Lead Time: Low to High', icon: <ArrowUpOutlined /> },
  { value: 'lead_time_desc', label: 'Lead Time: High to Low', icon: <ArrowDownOutlined /> },
  { value: 'supplier_asc', label: 'Supplier: A to Z', icon: <ArrowUpOutlined /> },
];

/**
 * SortDropdown Props Interface
 */
export interface SortDropdownProps extends Omit<SelectProps, 'options'> {
  /** Sort options to display */
  options?: SortOption[];
  
  /** Current sort value */
  value?: string;
  
  /** Callback when sort changes */
  onChange?: (value: string) => void;
  
  /** Placeholder text */
  placeholder?: string;
  
  /** Show sort icon in dropdown */
  showIcons?: boolean;
  
  /** Label for the dropdown */
  label?: string;
}

/**
 * SortDropdown Component
 * 
 * Features:
 * - 5 default sort options (price, lead time, supplier)
 * - Visual indicators for active sort
 * - Ascending/descending icons
 * - Customizable options
 */
export const SortDropdown: React.FC<SortDropdownProps> = ({
  options = DEFAULT_SORT_OPTIONS,
  value,
  onChange,
  placeholder = 'Sort by',
  showIcons = true,
  label,
  ...selectProps
}) => {
  /**
   * Render dropdown option with icon
   */
  const renderOption = (option: SortOption) => ({
    value: option.value,
    label: option.label,
    children: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {showIcons && option.icon}
        <span>{option.label}</span>
      </div>
    ),
  });

  /**
   * Generate select options
   */
  const selectOptions = React.useMemo(
    () => options.map((option) => ({
      value: option.value,
      label: option.label,
    })),
    [options]
  );

  /**
   * Render selected value with icon
   */
  const renderSelectedValue = (val: string) => {
    const selectedOption = options.find(opt => opt.value === val);
    if (!selectedOption) return val;

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {showIcons && selectedOption.icon}
        <span>{selectedOption.label}</span>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {label && <span style={{ fontWeight: 500 }}>{label}:</span>}
      <Select
        value={value}
        onChange={onChange}
        options={selectOptions}
        placeholder={placeholder}
        style={{ width: 220, ...selectProps.style }}
        dropdownRender={(menu) => (
          <div style={{ maxHeight: 300, overflow: 'auto' }}>
            {menu}
          </div>
        )}
        {...selectProps}
      />
    </div>
  );
};

export default SortDropdown;

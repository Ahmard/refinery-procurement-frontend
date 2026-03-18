'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Input, Spin } from 'antd';
import { SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { InputProps } from 'antd';
import { debounce } from '@/lib/utils/helpers';

/**
 * SearchBar Props Interface
 */
export interface SearchBarProps extends Omit<InputProps, 'onChange' | 'onSearch'> {
  /** Callback when search value changes (debounced) */
  onSearch?: (value: string) => void;
  
  /** Debounce delay in milliseconds (default: 300ms) */
  debounceMs?: number;
  
  /** Loading state for async search */
  loading?: boolean;
  
  /** Placeholder text */
  placeholder?: string;
  
  /** Allow clearing the search */
  allowClear?: boolean;
  
  /** Initial search value */
  defaultValue?: string;
}

/**
 * SearchBar Component
 * 
 * Features:
 * - Debounced input (300-500ms default)
 * - Clear button
 * - Loading indicator
 * - Search icon
 * - Customizable placeholder
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  debounceMs = 300,
  loading = false,
  placeholder = 'Search...',
  allowClear = true,
  defaultValue = '',
  ...inputProps
}) => {
  const [value, setValue] = useState(defaultValue);

  /**
   * Debounced search callback
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((val: string) => {
      onSearch?.(val);
    }, debounceMs),
    [onSearch, debounceMs]
  );

  /**
   * Handle value change
   */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  }, [debouncedSearch]);

  /**
   * Handle clear
   */
  const handleClear = useCallback(() => {
    setValue('');
    onSearch?.('');
  }, [onSearch]);

  /**
   * Update value when defaultValue changes
   */
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <Input
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      allowClear={allowClear ? { clearIcon: <CloseCircleOutlined /> } : false}
      prefix={
        loading ? (
          <Spin size="small" style={{ marginRight: 8 }} />
        ) : (
          <SearchOutlined style={{ color: '#999' }} />
        )
      }
      style={{ width: '100%', ...inputProps.style }}
      {...inputProps}
    />
  );
};

export default SearchBar;

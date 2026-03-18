'use client';

import React from 'react';
import { Spin, Skeleton } from 'antd';
import type { SpinProps, SkeletonProps } from 'antd';

/**
 * Loading Spinner Props
 */
export interface LoadingSpinnerProps extends SpinProps {
  /** Optional label text below spinner */
  label?: string;
  
  /** Size of the spinner (default: large) */
  size?: 'small' | 'default' | 'large';
}

/**
 * Loading Spinner Component
 * 
 * Reusable loading indicator:
 * - Uses Ant Design Spin component
 * - Centered layout with optional label
 * - Three size options
 * - Consistent styling across app
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label,
  size = 'large',
  style,
  ...spinProps
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        ...style,
      }}
    >
      <Spin size={size} {...spinProps} />
      {label && (
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          {label}
        </div>
      )}
    </div>
  );
};

/**
 * Catalog Item Skeleton Props
 */
export interface CatalogItemSkeletonProps extends SkeletonProps {
  /** Number of items to show in grid */
  count?: number;
}

/**
 * Catalog Item Skeleton
 * 
 * Skeleton screen for catalog grid view:
 * - Card-like structure matching CatalogItemCard
 * - Image placeholder
 * - Title and description lines
 * - Price and action button placeholders
 * - Responsive grid layout
 */
export const CatalogItemSkeleton: React.FC<CatalogItemSkeletonProps> = ({
  count = 8,
  active = true,
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          style={{
            border: '1px solid #f0f0f0',
            borderRadius: 8,
            padding: 16,
            backgroundColor: '#fff',
          }}
        >
          <Skeleton.Image active={active} />
          <Skeleton paragraph={{ rows: 2 }} title={false} active={active} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <Skeleton.Button active={active} size="small" style={{ width: 80 }} />
            <Skeleton.Button active={active} size="small" style={{ width: 60 }} />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * PO List Table Skeleton Props
 */
export interface POListSkeletonProps extends SkeletonProps {
  /** Number of rows to show */
  rowCount?: number;
}

/**
 * PO List Table Skeleton
 * 
 * Skeleton screen for purchase orders list:
 * - Table-like structure
 * - Header row
 * - Multiple data rows with skeleton cells
 * - Matches PO list table columns
 */
export const POListSkeleton: React.FC<POListSkeletonProps> = ({
  rowCount = 5,
  active = true,
}) => {
  return (
    <div style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8 }}>
      {/* Header Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '150px 200px 120px 130px 150px 150px 100px', gap: 16, marginBottom: 16 }}>
        <Skeleton.Node active={active} style={{ height: 32 }} />
        <Skeleton.Node active={active} style={{ height: 32 }} />
        <Skeleton.Node active={active} style={{ height: 32 }} />
        <Skeleton.Node active={active} style={{ height: 32 }} />
        <Skeleton.Node active={active} style={{ height: 32 }} />
        <Skeleton.Node active={active} style={{ height: 32 }} />
        <Skeleton.Node active={active} style={{ height: 32 }} />
      </div>

      {/* Data Rows */}
      {Array.from({ length: rowCount }).map((_, index) => (
        <div
          key={index}
          style={{
            display: 'grid',
            gridTemplateColumns: '150px 200px 120px 130px 150px 150px 100px',
            gap: 16,
            marginBottom: 12,
            paddingBottom: 12,
            borderBottom: index < rowCount - 1 ? '1px solid #f0f0f0' : 'none',
          }}
        >
          <Skeleton.Node active={active} style={{ height: 24 }} />
          <Skeleton.Node active={active} style={{ height: 24 }} />
          <Skeleton.Node active={active} style={{ height: 24 }} />
          <Skeleton.Node active={active} style={{ height: 24 }} />
          <Skeleton.Node active={active} style={{ height: 24 }} />
          <Skeleton.Node active={active} style={{ height: 24 }} />
          <Skeleton.Node active={active} style={{ height: 24 }} />
        </div>
      ))}
    </div>
  );
};

/**
 * PO Detail Skeleton Props
 */
export interface PODetailSkeletonProps extends SkeletonProps {}

/**
 * PO Detail Skeleton
 * 
 * Skeleton screen for purchase order detail page:
 * - Header section with back button and title
 * - Two-column layout (details + supplier info)
 * - Line items table skeleton
 * - Totals section
 */
export const PODetailSkeleton: React.FC<PODetailSkeletonProps> = ({
  active = true,
}) => {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Skeleton.Button active={active} size="large" style={{ width: 120, marginBottom: 16 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Skeleton active={active} title paragraph={{ rows: 1 }} />
          </div>
          <Skeleton.Node active={active} style={{ width: 100, height: 32 }} />
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Left Column */}
        <div>
          <Skeleton active={active} title paragraph={{ rows: 6 }} />
          
          <div style={{ marginTop: 16 }}>
            <Skeleton.Node active={active} style={{ width: 150, height: 32, marginBottom: 16 }} />
            <Skeleton active={active} title paragraph={{ rows: 8 }} />
            
            {/* Totals */}
            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <Skeleton.Node active={active} style={{ width: 200, height: 40 }} />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <Skeleton active={active} title paragraph={{ rows: 4 }} />
          
          <div style={{ marginTop: 16 }}>
            <Skeleton.Node active={active} style={{ width: 100, height: 32, marginBottom: 16 }} />
            <Skeleton.Button active={active} block style={{ marginBottom: 8 }} />
            <Skeleton.Button active={active} block style={{ marginBottom: 8 }} />
            <Skeleton.Button active={active} block />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Wizard Step Skeleton
 * 
 * Skeleton screen for wizard steps:
 * - Title and description
 * - Form fields skeleton
 * - Navigation buttons
 */
export const WizardStepSkeleton: React.FC<SkeletonProps> = ({
  active = true,
}) => {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <Skeleton active={active} title paragraph={{ rows: 2 }} />
      
      <div style={{ marginTop: 24 }}>
        <Skeleton.Node active={active} style={{ width: '100%', height: 60, marginBottom: 16 }} />
        <Skeleton.Node active={active} style={{ width: '100%', height: 60, marginBottom: 16 }} />
        <Skeleton.Node active={active} style={{ width: '100%', height: 60, marginBottom: 16 }} />
        <Skeleton.Node active={active} style={{ width: '100%', height: 100 }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        <Skeleton.Button active={active} size="large" style={{ width: 100 }} />
        <Skeleton.Button active={active} size="large" style={{ width: 100 }} />
      </div>
    </div>
  );
};

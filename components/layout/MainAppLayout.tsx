'use client';

import React from 'react';
import { Layout as AntdLayout } from 'antd';
import AppHeader from './Header';
import AppSidebar from './Sidebar';
import AppFooter from './Footer';

interface MainAppLayoutProps {
  children: React.ReactNode;
}

/**
 * Main Application Layout Wrapper
 * 
 * Wraps authenticated pages with Header, Sidebar, and Footer
 */
const MainAppLayout: React.FC<MainAppLayoutProps> = ({ children }) => {
  return (
    <AntdLayout style={{ minHeight: '100vh' }}>
      {/* Header */}
      <AppHeader />
      
      {/* Main content area with Sidebar */}
      <AntdLayout style={{ display: 'flex' }}>
        {/* Sidebar */}
        <AppSidebar />
        
        {/* Main content */}
        <AntdLayout
          style={{
            flex: 1,
            background: '#f0f2f5',
            padding: '24px',
            overflow: 'auto',
          }}
        >
          {children}
        </AntdLayout>
      </AntdLayout>
      
      {/* Footer */}
      <AppFooter />
    </AntdLayout>
  );
};

export default MainAppLayout;

'use client';

import React from 'react';
import { Layout as AntdLayout } from 'antd';
import AppHeader from './Header';
import AppSidebar from './Sidebar';
import AppFooter from './Footer';

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * Client-side Layout Wrapper
 * 
 * Wraps the entire application layout with Header, Sidebar, and Footer
 */
const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
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

export default AppLayout;

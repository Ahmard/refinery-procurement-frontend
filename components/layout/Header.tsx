'use client';

import React from 'react';
import { Layout, Button, Space } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useUIStore } from '@/lib/stores/uiStore';
import UserMenu from './UserMenu';

const { Header } = Layout;

/**
 * Main Header Component
 * 
 * Features:
 * - Logo/brand display
 * - Sidebar toggle button
 * - User menu with profile and logout
 */
const AppHeader: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <Header
      style={{
        padding: '0 24px',
        background: '#fff',
        boxShadow: '0 1px 4px rgba(0,21,41,.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Left side: Logo and sidebar toggle */}
      <Space size="large">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Sidebar toggle button */}
          <Button
            type="text"
            icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleSidebar}
            style={{ fontSize: 16, width: 32, height: 32 }}
          />
          
          {/* Logo/Brand */}
          <div style={{ marginLeft: 16, fontWeight: 600, fontSize: 18 }}>
            Refinery Procurement
          </div>
        </div>
      </Space>

      {/* Right side: User menu */}
      <UserMenu />
    </Header>
  );
};

export default AppHeader;

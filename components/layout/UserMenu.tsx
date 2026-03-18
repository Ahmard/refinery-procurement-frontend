'use client';

import React from 'react';
import { Dropdown, Avatar, Space } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useAuth } from '@/lib/hooks/useAuth';
import type { MenuProps } from 'antd';

/**
 * User Menu Component
 * 
 * Features:
 * - Shows user avatar and name
 * - Dropdown with profile and logout options
 */
const UserMenu: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  // Menu items
  const items: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      disabled: true, // Will be implemented later
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      disabled: true, // Will be implemented later
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: () => {
        logout();
        window.location.href = '/login';
      },
    },
  ];

  // If not authenticated, show login button or nothing
  if (!isAuthenticated || !user) {
    return null;
  }

  // Get user initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dropdown menu={{ items }} placement="bottomRight" arrow>
      <Space style={{ cursor: 'pointer' }}>
        <Avatar style={{ backgroundColor: '#1890ff' }}>
          {getInitials(user?.name)}
        </Avatar>
        <span style={{ display: 'inline-block', maxWidth: 120 }}>
          {user?.name || user?.email || 'User'}
        </span>
      </Space>
    </Dropdown>
  );
};

export default UserMenu;

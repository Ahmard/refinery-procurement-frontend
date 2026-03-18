'use client';

import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  ShoppingOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useUIStore } from '@/lib/stores/uiStore';
import { useRouter } from 'next/navigation';
import type { MenuProps } from 'antd';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

/**
 * Get menu items
 */
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

/**
 * Navigation menu items
 */
const menuItems: MenuItem[] = [
  getItem('Dashboard', '/', <HomeOutlined />),
  getItem('Items', '/items', <ShoppingOutlined />),
  getItem('Purchase Orders', '/purchase-orders', <FileTextOutlined />),
];

/**
 * Main Sidebar Component
 * 
 * Features:
 * - Navigation links (Dashboard, Catalog, Purchase Orders)
 * - Collapsible
 * - Responsive (drawer on mobile)
 */
interface AppSidebarProps {
  isMobile?: boolean;
  visible?: boolean;
  onClose?: () => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ 
  isMobile = false,
  visible = true,
  onClose 
}) => {
  const router = useRouter();
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const [selectedKeys, setSelectedKeys] = useState(['/']);

  // Initialize selected keys based on current path (client-side only)
  React.useEffect(() => {
    setSelectedKeys([window.location.pathname]);
  }, []);

  // Handle menu click
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    // Navigate to selected route
    router.push(e.key);
    setSelectedKeys([e.key]);
    
    // Close drawer on mobile after selection
    if (isMobile && onClose) {
      onClose();
    }
  };

  // If mobile and not visible, don't render
  if (isMobile && !visible) {
    return null;
  }

  // Common styles
  const sidebarStyle: React.CSSProperties = {
    background: '#001529',
    overflow: 'auto',
    height: '100vh',
    position: isMobile ? 'fixed' : 'relative',
    zIndex: 1000,
    ...(isMobile && {
      width: 250,
      left: visible ? 0 : -250,
      transition: 'left 0.3s',
    }),
  };

  return (
    <Sider
      collapsible={!isMobile}
      collapsed={sidebarCollapsed}
      onCollapse={(collapsed) => setSidebarCollapsed(collapsed)}
      breakpoint="lg"
      collapsedWidth={isMobile ? 0 : 80}
      style={sidebarStyle}
      width={250}
    >
      {/* Logo */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'center',
          background: '#002140',
          color: '#fff',
          fontSize: sidebarCollapsed && !isMobile ? 0 : 18,
          fontWeight: 600,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {!sidebarCollapsed || isMobile ? 'Refinery Procurement' : 'RP'}
      </div>

      {/* Navigation Menu */}
      <Menu
        theme="dark"
        mode="inline"
        items={menuItems}
        onClick={handleMenuClick}
        selectedKeys={selectedKeys}
      />
    </Sider>
  );
};

export default AppSidebar;

'use client';

import React from 'react';
import { Layout, Typography } from 'antd';

const { Footer } = Layout;
const { Text } = Typography;

/**
 * Main Footer Component
 * 
 * Features:
 * - Copyright information
 * - Simple, clean design
 */
const AppFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Footer
      style={{
        padding: '24px',
        background: '#fafafa',
        textAlign: 'center',
      }}
    >
      <Text type="secondary">
        © {currentYear} Refinery Procurement - Buyer Portal. All rights reserved.
      </Text>
    </Footer>
  );
};

export default AppFooter;

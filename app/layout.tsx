import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import QueryProvider from '@/components/providers/QueryProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Refinery Procurement - Buyer Portal",
  description: "Purchase Order Management System for Refinery Operations",
};

// Ant Design Theme Configuration
const antdTheme = {
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    borderRadius: 4,
    fontSize: 14,
  },
  components: {
    Button: {
      colorPrimary: '#1890ff',
      colorPrimaryHover: '#40a9ff',
      colorPrimaryActive: '#096dd9',
    },
    Badge: {
      colorDefault: '#d9d9d9', // DRAFT
      colorProcessing: '#1890ff', // SUBMITTED
      colorSuccess: '#52c41a', // APPROVED
      colorError: '#ff4d4f', // REJECTED
      colorPurple: '#722ed1', // FULFILLED
    },
    Table: {
      headerBg: '#fafafa',
      rowHoverBg: '#f5f5f5',
    },
    Input: {
      colorBorder: '#d9d9d9',
      controlHeight: 36,
    },
    Select: {
      colorBorder: '#d9d9d9',
      controlHeight: 36,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AntdRegistry>
          <ConfigProvider theme={antdTheme}>
            <QueryProvider>
              {children}
            </QueryProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}

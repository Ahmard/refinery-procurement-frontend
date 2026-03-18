'use client';

import React, { Suspense } from 'react';
import { Form, Input, Button, Typography, Card, Alert, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import type { LoginRequest } from '@/lib/api/auth';

const { Title, Text } = Typography;

/**
 * Login Form Component (uses useSearchParams)
 */
const LoginForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, error, clearError } = useAuth();
  
  const returnTo = searchParams.get('returnTo') || '/';

  /**
   * Handle form submission
   */
  const handleSubmit = async (values: LoginRequest) => {
    clearError();
    
    try {
      const result = await login(values);
      
      if (result.success) {
        // Redirect to returnTo URL or dashboard
        router.push(returnTo);
      } else {
        // Error is already set in auth store
        console.error('[Login] Login failed:', result.error);
      }
    } catch (err) {
      console.error('[Login] Unexpected error:', err);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '24px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Logo/Title */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ marginBottom: 8 }}>
            Refinery Procurement
          </Title>
          <Text type="secondary">Buyer Portal Login</Text>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            type="error"
            message={error}
            showIcon
            closable
            onClose={clearError}
            style={{ marginBottom: 24 }}
          />
        )}

        {/* Login Form */}
        <Form
          name="login"
          layout="vertical"
          requiredMark={false}
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
        >
          {/* Identifier Field */}
          <Form.Item
            label="Email or Phone"
            name="identifier"
            rules={[
              {
                required: true,
                message: 'Please enter your email or phone number',
              },
              {
                pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$|^(\+\d{1,3})?[\d\s\-()]{7,15}$/,
                message: 'Please enter a valid email or phone number',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your email or phone"
              disabled={isLoading}
            />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please enter your password',
              },
              {
                min: 4,
                message: 'Password must be at least 4 characters',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
              size="large"
              style={{ marginTop: 8 }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Form.Item>
        </Form>

        {/* Demo Credentials Hint */}
        <div style={{ marginTop: 24, padding: '16px', background: '#f5f5f5', borderRadius: 4 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            <strong>Demo Credentials:</strong><br />
            Email: buyer@refinery.com<br />
            Password: password123
          </Text>
        </div>
      </Card>
    </div>
  );
};

/**
 * Login Page Component with Suspense boundary
 * 
 * Features:
 * - Email/phone + password authentication
 * - Form validation
 * - Loading state during login
 * - Error message display
 * - Redirect to returnTo URL or dashboard on success
 */
const LoginPage: React.FC = () => {
  return (
    <Suspense fallback={
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Spin size="large" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
};

export default LoginPage;

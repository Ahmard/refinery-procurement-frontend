'use client';

import React from 'react';
import { Form, Input, DatePicker, Select, Typography, Row, Col } from 'antd';
import type { FormProps } from 'antd';
import { format, isBefore, startOfDay } from 'date-fns';
import { POHeaderFormData, poHeaderSchema } from '@/lib/utils/validators';

const { Title } = Typography;
const { TextArea } = Input;

/**
 * PO Header Form Props
 */
export interface POHeaderFormProps extends Omit<FormProps, 'form' | 'onFinish'> {
  /** Initial form data */
  initialValues?: Partial<POHeaderFormData>;
  
  /** Callback when form values change */
  onValuesChange?: (values: Partial<POHeaderFormData>) => void;
  
  /** Callback when form is validated successfully */
  onValid?: (values: POHeaderFormData) => void;
  
  /** Whether the form is being submitted */
  loading?: boolean;
}

const DEFAULT_COST_CENTER = 'CC-1234';

/**
 * Payment terms options
 */
const PAYMENT_TERMS_OPTIONS = [
  { value: 'NET_30', label: 'Net 30 Days' },
  { value: 'NET_60', label: 'Net 60 Days' },
  { value: 'NET_90', label: 'Net 90 Days' },
  { value: 'COD', label: 'Cash on Delivery (COD)' },
  { value: 'PREPAID', label: 'Prepaid' },
];

/**
 * PO Header Form Component
 * 
 * Step 1 of PO Create Wizard - Collects header information:
 * - Requestor (required)
 * - Cost Center (default: CC-1234)
 * - Needed-by date picker
 * - Payment terms (select)
 * 
 * Features:
 * - Real-time validation with Zod schema
 * - Error messages below fields
 * - Next button disabled until valid
 * - Form data saved to wizard state
 */
export const POHeaderForm: React.FC<POHeaderFormProps> = ({
  initialValues,
  onValuesChange,
  onValid,
  loading = false,
  ...formProps
}) => {
  const [form] = Form.useForm<POHeaderFormData>();

  /**
   * Handle form values change
   */
  const handleValuesChange = (changedValues: any, allValues: POHeaderFormData) => {
    onValuesChange?.(allValues);
    
    // Validate and call onValid if successful
    try {
      const validated = poHeaderSchema.parse(allValues);
      onValid?.(validated);
    } catch {
      // Form is invalid, don't call onValid
    }
  };

  return (
    <div>
      <Title level={4}>Header Information</Title>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Enter the purchase order header details
      </p>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          cost_center: DEFAULT_COST_CENTER,
          payment_terms: 'NET_30',
          ...initialValues,
        }}
        onValuesChange={handleValuesChange}
        {...formProps}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="requestor"
              label="Requestor Name"
              required
              rules={[
                { required: true, message: 'Please enter requestor name' },
                { min: 2, message: 'Requestor name must be at least 2 characters' },
              ]}
              tooltip="Name of the person requesting this purchase order"
            >
              <Input
                placeholder="e.g., John Smith"
                size="large"
                autoComplete="off"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="cost_center"
              label="Cost Center"
              required
              rules={[
                { required: true, message: 'Please enter cost center' },
                { pattern: /^CC-\d{4}$/, message: 'Cost center must be in format CC-1234' },
              ]}
              tooltip="Department cost center code"
            >
              <Input
                placeholder="CC-1234"
                size="large"
                addonBefore="CC-"
                maxLength={8}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="needed_by_date"
              label="Needed By Date"
              tooltip="When do you need these items delivered by?"
            >
              <DatePicker
                style={{ width: '100%' }}
                size="large"
                disabledDate={(current) => {
                  const today = startOfDay(new Date());
                  const selectedDate = new Date(current?.valueOf() || 0);
                  return isBefore(selectedDate, today);
                }}
                format="YYYY-MM-DD"
                placeholder="Select date"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="payment_terms"
              label="Payment Terms"
              required
              rules={[{ required: true, message: 'Please select payment terms' }]}
              tooltip="Payment terms for this purchase order"
            >
              <Select
                size="large"
                placeholder="Select payment terms"
                options={PAYMENT_TERMS_OPTIONS}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="notes"
          label="Additional Notes"
          tooltip="Any additional information or special instructions"
        >
          <TextArea
            rows={4}
            placeholder="Enter any special instructions or notes..."
            showCount
            maxLength={500}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default POHeaderForm;

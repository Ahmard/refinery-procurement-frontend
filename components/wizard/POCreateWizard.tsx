'use client';

import React, { useState } from 'react';
import { Steps, Button, Space, Typography, Divider } from 'antd';
import type { StepsProps } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

const { Title } = Typography;

/**
 * Wizard step configuration
 */
export interface WizardStep {
  /** Step title */
  title: string;
  
  /** Step description */
  description?: string;
  
  /** Whether this step is optional (default: false) */
  optional?: boolean;
}

/**
 * POCreateWizard Props
 */
export interface POCreateWizardProps {
  /** Current step index (0-based) */
  currentStep?: number;
  
  /** Callback when step changes */
  onStepChange?: (step: number) => void;
  
  /** Callback when wizard is cancelled */
  onCancel?: () => void;
  
  /** Callback when wizard is completed successfully */
  onSuccess?: (poNumber: string) => void;
  
  /** Loading state for actions */
  loading?: boolean;
  
  /** Whether the Next button should be disabled */
  nextDisabled?: boolean;
  
  /** Custom steps configuration */
  steps?: WizardStep[];
}

/**
 * Default wizard steps configuration
 */
const DEFAULT_STEPS: WizardStep[] = [
  {
    title: 'Header Information',
    description: 'Enter PO details',
  },
  {
    title: 'Select Items',
    description: 'Add items to PO',
  },
  {
    title: 'Review',
    description: 'Verify all information',
  },
  {
    title: 'Submit',
    description: 'Complete and submit',
  },
];

/**
 * PO Create Wizard Component
 * 
 * 4-step wizard framework using Ant Design Steps:
 * - Step 1: Header Information Form
 * - Step 2: Items Selection
 * - Step 3: Review & Edit
 * - Step 4: Submit with Idempotency
 * 
 * Features:
 * - Step navigation (Next/Back buttons)
 * - Prevent skip ahead logic
 * - Data persistence across steps
 * - onCancel and onSuccess callbacks
 */
export const POCreateWizard: React.FC<POCreateWizardProps> = ({
  currentStep = 0,
  onStepChange,
  onCancel,
  onSuccess,
  loading = false,
  nextDisabled = false,
  steps = DEFAULT_STEPS,
}) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  /**
   * Handle step change
   */
  const handleStepChange = (newStep: number) => {
    // Prevent skipping ahead
    if (newStep > currentStep && newStep > Math.max(...completedSteps, -1) + 1) {
      return;
    }
    
    // Track completed steps
    if (newStep > currentStep && !completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    
    onStepChange?.(newStep);
  };

  /**
   * Handle Next button click
   */
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      handleStepChange(currentStep + 1);
    } else {
      // Final step - trigger submission
      onSuccess?.('');
    }
  };

  /**
   * Handle Back button click
   */
  const handleBack = () => {
    if (currentStep > 0) {
      handleStepChange(currentStep - 1);
    }
  };

  /**
   * Get button text for final step
   */
  const getFinalButtonText = () => {
    if (loading) {
      return 'Submitting...';
    }
    return 'Submit Purchase Order';
  };

  /**
   * Render step content based on current step
   */
  const renderStepContent = () => {
    // This is a framework component - actual form/content will be implemented in subsequent tasks
    return (
      <div style={{ minHeight: 400, padding: '24px 0' }}>
        <Title level={4}>{steps[currentStep].title}</Title>
        {steps[currentStep].description && (
          <p style={{ color: '#666' }}>{steps[currentStep].description}</p>
        )}
        <Divider />
        {/* Step-specific content will be rendered here by child components */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: 300,
          border: '1px dashed #d9d9d9',
          borderRadius: 4,
          backgroundColor: '#fafafa',
        }}>
          <Space direction="vertical" align="center">
            <Title level={5} type="secondary">
              Step {currentStep + 1}: {steps[currentStep].title}
            </Title>
            <Button type="primary" onClick={() => handleStepChange(currentStep + 1)}>
              Proceed to Next Step
            </Button>
          </Space>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Steps Navigation */}
      <Steps
        current={currentStep}
        onChange={handleStepChange}
        items={steps.map((step, index) => ({
          key: step.title,
          title: step.title,
          description: step.description,
          icon: completedSteps.includes(index) ? <CheckOutlined /> : undefined,
        }))}
        size="small"
        style={{ marginBottom: 24 }}
      />

      {/* Step Content Area */}
      {renderStepContent()}

      {/* Action Buttons */}
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>

        <Space>
          {currentStep > 0 && (
            <Button onClick={handleBack} disabled={loading}>
              Back
            </Button>
          )}
          
          {currentStep < steps.length - 1 ? (
            <Button
              type="primary"
              onClick={handleNext}
              disabled={nextDisabled || loading}
              loading={loading && currentStep === steps.length - 1}
            >
              Next
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={handleNext}
              disabled={nextDisabled}
              loading={loading}
              icon={<CheckOutlined />}
            >
              {getFinalButtonText()}
            </Button>
          )}
        </Space>
      </div>
    </div>
  );
};

export default POCreateWizard;

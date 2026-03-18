import { z } from 'zod';

/**
 * Validators - Zod schemas for form validation
 */

/**
 * Login form schema
 */
export const loginSchema = z.object({
  identifier: z.string()
    .min(1, 'Email or phone is required')
    .refine(
      val => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$|^(\+\d{1,3})?[\d\s\-()]{7,15}$/.test(val),
      'Please enter a valid email or phone number'
    ),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Purchase Order Header schema
 */
export const poHeaderSchema = z.object({
  requestor: z.string()
    .min(1, 'Requestor name is required')
    .min(2, 'Requestor name must be at least 2 characters'),
  costCenter: z.string()
    .default('CC-1234'),
  neededByDate: z.string()
    .min(1, 'Needed by date is required')
    .refine(
      val => !isNaN(Date.parse(val)),
      'Please enter a valid date'
    ),
  paymentTerms: z.string()
    .min(1, 'Payment terms are required'),
});

export type POHeaderFormData = z.infer<typeof poHeaderSchema>;

/**
 * Catalog item quantity schema
 */
export const catalogItemQuantitySchema = z.object({
  itemId: z.string().uuid('Invalid item ID'),
  quantity: z.number()
    .int('Quantity must be a whole number')
    .positive('Quantity must be greater than 0')
    .max(999999, 'Quantity exceeds maximum allowed'),
});

export type CatalogItemQuantityFormData = z.infer<typeof catalogItemQuantitySchema>;

/**
 * Supplier schema
 */
export const supplierSchema = z.object({
  name: z.string()
    .min(1, 'Supplier name is required')
    .max(150, 'Supplier name must not exceed 150 characters'),
  contactEmail: z.string()
    .email('Please enter a valid email address'),
  contactPhone: z.string()
    .optional()
    .refine(
      val => !val || /^(\+\d{1,3})?[\d\s\-()]{7,15}$/.test(val),
      'Please enter a valid phone number'
    ),
  address: z.string()
    .optional(),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;

/**
 * Common validation patterns
 */
export const validationPatterns = {
  email: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
  phone: /^(\+\d{1,3})?[\d\s\-()]{7,15}$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  alphanumericWithSpaces: /^[a-zA-Z0-9\s]+$/,
};

/**
 * Generic positive number validator
 */
export function positiveNumber(message: string = 'Value must be positive') {
  return z.number()
    .positive(message)
    .finite('Value must be a finite number');
}

/**
 * Optional string validator
 */
export function optionalString() {
  return z.string().optional().nullable();
}

/**
 * Required string validator
 */
export function requiredString(fieldName: string = 'This field') {
  return z.string()
    .min(1, `${fieldName} is required`)
    .trim();
}

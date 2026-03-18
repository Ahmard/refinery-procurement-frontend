/**
 * Responsive Design Utilities
 * 
 * Breakpoints (Ant Design defaults):
 * - xs: 480px (mobile landscape)
 * - sm: 576px (tablet portrait)
 * - md: 768px (tablet landscape)
 * - lg: 992px (desktop)
 * - xl: 1200px (large desktop)
 */

/**
 * Media query helper
 */
export const mediaQueries = {
  xs: '@media (min-width: 480px)',
  sm: '@media (min-width: 576px)',
  md: '@media (min-width: 768px)',
  lg: '@media (min-width: 992px)',
  xl: '@media (min-width: 1200px)',
};

/**
 * Screen size detection helpers (for client-side only)
 */
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

export const isTablet = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 768 && window.innerWidth < 992;
};

export const isDesktop = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 992;
};

/**
 * Responsive spacing values
 */
export const responsiveSpacing = {
  mobile: { padding: 16, gap: 12 },
  tablet: { padding: 24, gap: 16 },
  desktop: { padding: 24, gap: 24 },
};

/**
 * Touch target minimum size (accessibility)
 */
export const TOUCH_TARGET_SIZE = 44; // pixels

/**
 * Responsive font sizes
 */
export const responsiveFontSizes = {
  heading1: { mobile: 24, tablet: 28, desktop: 32 },
  heading2: { mobile: 20, tablet: 24, desktop: 28 },
  heading3: { mobile: 18, tablet: 20, desktop: 24 },
  body: { mobile: 14, tablet: 14, desktop: 16 },
  small: { mobile: 12, tablet: 12, desktop: 14 },
};

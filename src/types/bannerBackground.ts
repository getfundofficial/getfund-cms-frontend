/**
 * Common interface for banner background settings
 * Used across all page content editors
 */
export interface BannerBackground {
  imageUrl?: string | null;
  tintColor?: string;
  tintColor2?: string; // Second color for gradient
  gradientDirection?: 'to right' | 'to bottom' | 'to bottom right' | 'to top right'; // Gradient direction
  useGradient?: boolean; // Toggle between solid color and gradient
  tintOpacity?: number;
}

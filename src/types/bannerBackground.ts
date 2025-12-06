/**
 * Common interface for banner background settings
 * Used across all page content editors
 */
export interface BannerBackground {
  imageUrl?: string | null;
  tintColor?: string;
  tintOpacity?: number;
}

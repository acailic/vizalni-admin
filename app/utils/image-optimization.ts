/**
 * Image Optimization Utilities
 *
 * Utilities for generating optimized image paths and configurations
 */

export interface ImageSize {
  name: string;
  width: number;
  quality?: number;
}

export interface ImageOptimizationOptions {
  /**
   * Base path to the image (without extension)
   */
  basePath: string;

  /**
   * Original file extension
   */
  extension: string;

  /**
   * Available sizes for the image
   */
  sizes?: ImageSize[];

  /**
   * Preferred image format
   */
  format?: 'webp' | 'avif' | 'auto';

  /**
   * Fallback to original format
   */
  fallback?: boolean;
}

// Default image sizes
const DEFAULT_SIZES: ImageSize[] = [
  { name: 'small', width: 400, quality: 70 },
  { name: 'medium', width: 800, quality: 75 },
  { name: 'large', width: 1200, quality: 80 },
];

/**
 * Get the best image size based on container width and device pixel ratio
 */
export function getOptimalSize(
  containerWidth: number,
  dpr = 1,
  availableSizes: ImageSize[] = DEFAULT_SIZES
): ImageSize {
  const targetWidth = containerWidth * dpr;

  // Find the smallest size that can accommodate the target width
  const optimalSize = availableSizes
    .slice()
    .sort((a, b) => b.width - a.width)
    .find(size => size.width >= targetWidth);

  // If no size is large enough, use the largest available
  return optimalSize || availableSizes[availableSizes.length - 1];
}

/**
 * Generate optimized image paths
 */
export function generateImagePaths(options: ImageOptimizationOptions): {
  optimized: string[];
  fallback: string;
  srcSet: string;
} {
  const { basePath, extension, sizes = DEFAULT_SIZES, format = 'webp', fallback = true } = options;

  const optimized: string[] = [];
  const srcSetEntries: string[] = [];

  // Generate paths for each size
  sizes.forEach((size) => {
    const quality = size.quality || 75;
    const optimizedPath = `${basePath}_${size.name}.${format}`;
    optimized.push(optimizedPath);
    srcSetEntries.push(`${optimizedPath} ${size.width}w`);
  });

  // Generate high-quality version
  const highQualityPath = `${basePath}.${format}`;
  optimized.push(highQualityPath);
  srcSetEntries.push(`${highQualityPath} ${sizes[sizes.length - 1].width + 1}w`);

  // Fallback to original format
  const fallbackPath = fallback ? `${basePath}${extension}` : highQualityPath;

  return {
    optimized,
    fallback: fallbackPath,
    srcSet: srcSetEntries.join(', '),
  };
}

/**
 * Generate responsive sizes string for Next.js Image
 */
export function generateResponsiveSizes(
  breakpoints: { max: number; size: string }[] = [
    { max: 640, size: '100vw' },
    { max: 1024, size: '50vw' },
    { max: 1536, size: '33vw' },
  ],
  maxSize: string = '1200px'
): string {
  const sizes = breakpoints
    .map(b => `(max-width: ${b.max}px) ${b.size}`)
    .join(', ');

  return `${sizes}, ${maxSize}`;
}

/**
 * Check if WebP is supported in the browser
 */
export function supportsWebP(): boolean {
  if (typeof window === 'undefined') return true; // Server-side default

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

/**
 * Check if AVIF is supported in the browser
 */
export function supportsAVIF(): boolean {
  if (typeof window === 'undefined') return false; // Server-side default

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
}

/**
 * Get the best format for the current browser
 */
export function getOptimalFormat(): 'webp' | 'avif' | 'png' {
  if (supportsAVIF()) return 'avif';
  if (supportsWebP()) return 'webp';
  return 'png';
}

/**
 * Generate blur placeholder for Next.js Image
 */
export function generateBlurPlaceholder(imagePath: string): Promise<string> | string {
  // This would typically use a server-side utility to generate blur data
  // For now, return a placeholder
  return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A';
}

/**
 * Image loading optimization utilities
 */
export const imageOptimization = {
  getOptimalSize,
  generateImagePaths,
  generateResponsiveSizes,
  supportsWebP,
  supportsAVIF,
  getOptimalFormat,
  generateBlurPlaceholder,
  DEFAULT_SIZES,
};

export default imageOptimization;
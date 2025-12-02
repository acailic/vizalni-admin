import { Box, BoxProps } from "@mui/material";
import NextImage, { ImageProps as NextImageProps } from "next/image";

export interface ResponsiveImageProps extends Omit<NextImageProps, 'sizes'> {
  /**
   * Container width - defaults to 100%
   */
  containerWidth?: number | string;

  /**
   * Container height - optional
   */
  containerHeight?: number | string;

  /**
   * Maximum container width
   */
  maxWidth?: number | string;

  /**
   * Box props for the container
   */
  containerProps?: BoxProps;

  /**
   * Whether to make the image fill the container
   */
  fillContainer?: boolean;

  /**
   * Whether to add a loading skeleton
   */
  showSkeleton?: boolean;

  /**
   * Priority loading for above-the-fold images
   */
  priority?: boolean;

  /**
   * Enable blur placeholder for better LCP
   */
  enableBlur?: boolean;

  /**
   * Critical image - preload for instant loading
   */
  critical?: boolean;
}

/**
 * Performance-Optimized Responsive Image Component
 *
 * A wrapper around Next.js Image that provides responsive behavior
 * with advanced performance optimizations for fastest possible loading.
 */
export const ResponsiveImage = ({
  containerWidth = "100%",
  containerHeight,
  maxWidth,
  containerProps = {},
  fillContainer = false,
  showSkeleton = true,
  priority = false,
  enableBlur = false,
  critical = false,
  style,
  ...imageProps
}: ResponsiveImageProps) => {
  // Generate responsive sizes based on maxWidth
  const generateSizes = () => {
    if (typeof maxWidth === 'number') {
      return `(max-width: ${maxWidth}px) 100vw, ${maxWidth}px`;
    }
    if (typeof maxWidth === 'string' && maxWidth.includes('px')) {
      const numericMaxWidth = parseInt(maxWidth);
      return `(max-width: ${numericMaxWidth}px) 100vw, ${numericMaxWidth}px`;
    }
    return "100vw";
  };

  const sizes = imageProps.sizes || generateSizes();

  // Performance optimizations
  const blurDataURL = enableBlur ? `data:image/svg+xml;base64,${btoa(
    `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <rect width="20%" height="20%" fill="#e0e0e0" x="10" y="10"/>
      <rect width="30%" height="30%" fill="#d0d0d0" x="20" y="15"/>
    </svg>`
  )}` : undefined;

  // Container styles
  const containerStyle = {
    position: "relative" as const,
    width: containerWidth,
    height: fillContainer ? "100%" : containerHeight || "auto",
    maxWidth: maxWidth || "100%",
    overflow: "hidden",
    // Performance optimizations
    contain: "layout paint" as const,
    willChange: "opacity" as const,
    ...containerProps.sx,
  };

  // Image styles
  const imageStyle = {
    objectFit: "contain" as const,
    // Performance optimizations
    opacity: 0,
    transition: "opacity 0.3s ease-in-out",
    ...style,
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Fade in image when loaded
    (e.target as HTMLImageElement).style.opacity = '1';

    // Hide skeleton when image loads
    const skeleton = e.currentTarget.parentElement?.querySelector('[style*="pulse"]');
    if (skeleton) {
      (skeleton as HTMLElement).style.display = 'none';
    }

    imageProps.onLoad?.(e);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Hide skeleton on error
    const skeleton = e.currentTarget.parentElement?.querySelector('[style*="pulse"]');
    if (skeleton) {
      (skeleton as HTMLElement).style.display = 'none';
    }
    imageProps.onError?.(e);
  };

  return (
    <Box {...containerProps} sx={containerStyle}>
      {showSkeleton && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "grey.100",
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            "@keyframes pulse": {
              "0%, 100%": { opacity: 1 },
              "50%": { opacity: 0.5 },
            },
            zIndex: 1,
          }}
        />
      )}
      {critical && (
        <link
          rel="preload"
          as="image"
          href={imageProps.src as string}
          imageSrcSet={imageProps.srcSet}
          imageSizes={sizes}
        />
      )}
      <NextImage
        {...imageProps}
        sizes={sizes}
        style={imageStyle}
        fill={fillContainer || !imageProps.width || !imageProps.height}
        className={`next-image ${imageProps.className || ""}`}
        priority={priority || critical}
        placeholder={enableBlur ? "blur" : imageProps.placeholder}
        blurDataURL={blurDataURL}
        quality={imageProps.quality || 85} // Slightly reduced for better performance
        onLoad={handleImageLoad}
        onError={handleImageError}
        // Performance attributes
        decoding="async"
        loading={priority || critical ? "eager" : "lazy"}
      />
    </Box>
  );
};

export default ResponsiveImage;
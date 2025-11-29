import { GetStaticProps } from "next";
import Box from "@mui/material/Box";

import { DemoGallery } from "../_components/DemoGallery";

interface GalleryPageProps {
  // Add any props needed for the gallery here
  fallbackData?: any;
}

export default function GalleryPage({ fallbackData = {} }: GalleryPageProps) {
  return (
    <Box>
      <DemoGallery fallbackData={fallbackData} />
    </Box>
  );
}

export const getStaticProps: GetStaticProps<GalleryPageProps> = async () => {
  try {
    // Pre-fetch gallery data for SSG
    // This would typically come from your data source
    const galleryData = {}; // Replace with actual data fetching

    return {
      props: {
        fallbackData: galleryData,
      },
      revalidate: 3600, // Revalidate every hour for new demos
    };
  } catch (error) {
    console.error('Failed to fetch gallery data:', error);
    return {
      props: {
        fallbackData: {},
      },
      revalidate: 300, // Retry more frequently on error
    };
  }
};

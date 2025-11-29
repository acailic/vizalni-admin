import dynamic from 'next/dynamic';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LazyDemoWrapperProps {
  demoPath: string;
  title: string;
}

// Create a reusable lazy loading wrapper for demo components
const createLazyDemo = (importPath: string) => {
  return dynamic(
    () => import(importPath).then(mod => ({ default: mod.default })),
    {
      loading: () => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: 2,
          }}
        >
          <CircularProgress size={40} />
          <Typography variant="body1" color="text.secondary">
            Loading demo...
          </Typography>
        </Box>
      ),
      ssr: false, // Disable server-side rendering for better performance
    }
  );
};

// Factory function to create lazy demo components
export const createLazyDemoComponent = (demoPath: string) => {
  return createLazyDemo(`../${demoPath}`);
};

// Predefined lazy demo components for the most expensive demos
export const LazyAirQualityDemo = createLazyDemoComponent('demos/air-quality.tsx');
export const LazyDigitalDemo = createLazyDemoComponent('demos/digital.tsx');
export const LazyTransportDemo = createLazyDemoComponent('demos/transport.tsx');
export const LazyClimateDemo = createLazyDemoComponent('demos/climate.tsx');
export const LazyEnergyDemo = createLazyDemoComponent('demos/energy.tsx');
export const LazyPresentationEnhancedDemo = createLazyDemoComponent('demos/presentation-enhanced.tsx');
export const LazyEconomyDemo = createLazyDemoComponent('demos/economy.tsx');
export const LazyDemographicsDemo = createLazyDemoComponent('demos/demographics.tsx');
export const LazyHealthcareDemo = createLazyDemoComponent('demos/healthcare.tsx');
export const LazyEmploymentDemo = createLazyDemoComponent('demos/employment.tsx');
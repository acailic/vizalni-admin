import { Box, CircularProgress, Typography } from '@mui/material';
import dynamic from 'next/dynamic';

const demoImporters = {
  'demos/air-quality': () => import('../demos/air-quality'),
  'demos/digital': () => import('../demos/digital'),
  'demos/transport': () => import('../demos/transport'),
  'demos/climate': () => import('../demos/climate'),
  'demos/energy': () => import('../demos/energy'),
  'demos/presentation-enhanced': () => import('../demos/presentation-enhanced'),
  'demos/economy': () => import('../demos/economy'),
  'demos/demographics': () => import('../demos/demographics'),
  'demos/healthcare': () => import('../demos/healthcare'),
  'demos/employment': () => import('../demos/employment'),
} as const;

type DemoImportPath = keyof typeof demoImporters;

// Create a reusable lazy loading wrapper for demo components
const createLazyDemo = (importPath: DemoImportPath) => {
  return dynamic(
    () => demoImporters[importPath]().then(mod => ({ default: mod.default })),
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
export const createLazyDemoComponent = (demoPath: DemoImportPath) => {
  return createLazyDemo(demoPath);
};

// Predefined lazy demo components for the most expensive demos
export const LazyAirQualityDemo = createLazyDemoComponent('demos/air-quality');
export const LazyDigitalDemo = createLazyDemoComponent('demos/digital');
export const LazyTransportDemo = createLazyDemoComponent('demos/transport');
export const LazyClimateDemo = createLazyDemoComponent('demos/climate');
export const LazyEnergyDemo = createLazyDemoComponent('demos/energy');
export const LazyPresentationEnhancedDemo = createLazyDemoComponent('demos/presentation-enhanced');
export const LazyEconomyDemo = createLazyDemoComponent('demos/economy');
export const LazyDemographicsDemo = createLazyDemoComponent('demos/demographics');
export const LazyHealthcareDemo = createLazyDemoComponent('demos/healthcare');
export const LazyEmploymentDemo = createLazyDemoComponent('demos/employment');

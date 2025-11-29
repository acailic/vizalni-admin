import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { Container, Typography, Box, Alert } from '@mui/material';
import PerformanceDashboard from '../components/performance/Dashboard';
import { Layout } from '../components/layout';

interface PerformancePageProps {
  locale: string;
}

const PerformancePage: React.FC<PerformancePageProps> = ({ locale }) => {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <Head>
        <title>Performance Analytics - Vizualni Admin</title>
        <meta name="description" content="Monitor application performance and Core Web Vitals" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box mb={4}>
          <Typography variant="h3" component="h1" gutterBottom>
            Performance Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Monitor real-time application performance, Core Web Vitals, and user experience metrics.
            Track LCP, FID, CLS, FCP, and TTFB to ensure optimal performance for Serbian data visualization.
          </Typography>
        </Box>

        {process.env.NODE_ENV === 'development' && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              This is the development version of the performance dashboard. In production,
              metrics are collected from real users and aggregated for analytics.
            </Typography>
          </Alert>
        )}

        <PerformanceDashboard />
      </Container>
    </Layout>
  );
};

export default PerformancePage;

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
    },
  };
};
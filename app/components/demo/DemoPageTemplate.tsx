import React, { useState } from 'react';
import { Box, Container, Typography, Alert, Button, Tabs, Tab, Paper, Stack, useTheme, useMediaQuery } from '@mui/material';
import { Trans } from '@lingui/macro';
import { useProgressiveData } from '../../hooks/use-progressive-data';
import { useDatasetInsights } from '../../hooks/use-dataset-insights';
import { VirtualizedTable } from '../VirtualizedTable';
import { ProgressIndicator } from '../ProgressIndicator';
import { InsightsPanel } from '../insights/InsightsPanel';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import TableChartIcon from '@mui/icons-material/TableChart';

interface DemoPageTemplateProps {
  title: React.ReactNode;
  description: React.ReactNode;
  datasetId: string;
  columns: any[];
  chartComponent?: React.ReactNode;
  fallbackData?: any[];
}

export const DemoPageTemplate: React.FC<DemoPageTemplateProps> = ({
  title,
  description,
  datasetId,
  columns,
  chartComponent,
  fallbackData = []
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Data loading with progressive loader
  const {
    data,
    loading: dataLoading,
    progress,
    hasMore,
    loadNext,
    error: dataError
  } = useProgressiveData(
    async (chunk, size) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // If we have fallback data, use it
      if (fallbackData.length > 0) {
        const start = chunk * size;
        const end = start + size;
        return {
          data: fallbackData.slice(start, end),
          total: fallbackData.length
        };
      }

      return { data: [], total: 0 };
    },
    { chunkSize: 100 }
  );

  // AI Insights
  const {
    insights,
    loading: insightsLoading,
    error: insightsError,
    refresh: refreshInsights
  } = useDatasetInsights(datasetId);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-start', gap: 2 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800 }}>
            {description}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ width: isMobile ? '100%' : 'auto' }}>
          <Button startIcon={<ShareIcon />} variant="outlined" fullWidth={isMobile}>
            <Trans>Share</Trans>
          </Button>
          <Button startIcon={<DownloadIcon />} variant="contained" fullWidth={isMobile}>
            <Trans>Export</Trans>
          </Button>
        </Stack>
      </Box>

      {/* Main Content */}
      <Box sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons="auto"
        >
          <Tab label={<Trans>Dashboard</Trans>} />
          <Tab label={<Trans>Data Explorer</Trans>} />
          <Tab label={<Trans>AI Insights</Trans>} />
        </Tabs>

        {/* Dashboard Tab */}
        {activeTab === 0 && (
          <Box>
            {chartComponent}

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                <Trans>Key Insights</Trans>
              </Typography>
              <InsightsPanel
                insights={insights.slice(0, 2)} // Show top 2 insights
                loading={insightsLoading}
                error={insightsError}
              />
            </Box>
          </Box>
        )}

        {/* Data Explorer Tab */}
        {activeTab === 1 && (
          <Paper variant="outlined" sx={{ p: 0, overflow: 'hidden', height: 600, display: 'flex', flexDirection: 'column' }}>
            {dataLoading && data.length === 0 ? (
              <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <ProgressIndicator progress={progress} message={<Trans>Loading dataset...</Trans>} />
              </Box>
            ) : dataError ? (
              <Alert severity="error" sx={{ m: 2 }}>{dataError.message}</Alert>
            ) : data.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                <TableChartIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                <Typography variant="h6"><Trans>No data available</Trans></Typography>
                <Typography variant="body2"><Trans>This dataset appears to be empty.</Trans></Typography>
              </Box>
            ) : (
              <>
                <VirtualizedTable
                  data={data}
                  columns={columns}
                  rowHeight={50}
                  height={550}
                />
                <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    <Trans>{data.length} rows loaded</Trans>
                  </Typography>
                  {hasMore && (
                    <Button size="small" onClick={() => loadNext()} disabled={dataLoading}>
                      {dataLoading ? <Trans>Loading...</Trans> : <Trans>Load More</Trans>}
                    </Button>
                  )}
                </Box>
              </>
            )}
          </Paper>
        )}

        {/* AI Insights Tab */}
        {activeTab === 2 && (
          <Box>
            <InsightsPanel
              insights={insights}
              loading={insightsLoading}
              error={insightsError}
              onRefresh={refreshInsights}
            />
          </Box>
        )}
      </Box>
    </Container>
  );
};

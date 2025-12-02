import { Trans, defineMessage } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import ShareIcon from '@mui/icons-material/Share';
import TableChartIcon from '@mui/icons-material/TableChart';
import {
  Alert,
  Box,
  Button,
  Container,
  InputAdornment,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useDatasetInsights, UseDatasetInsightsOptions } from '../../hooks/use-dataset-insights';
import { useProgressiveData } from '../../hooks/use-progressive-data';
import { InsightsPanel } from '../insights/InsightsPanel';
import { ProgressIndicator } from '../ProgressIndicator';
import { VirtualizedTable } from '../VirtualizedTable';

interface DemoPageTemplateProps {
  title: React.ReactNode;
  description: React.ReactNode;
  datasetId: string;
  columns: any[];
  chartComponent?: React.ReactNode;
  fallbackData?: any[];
  dataLoader?: (chunkIndex: number, chunkSize: number) => Promise<{ data: any[]; total: number }>;
  chunkSize?: number;
  insightsConfig?: UseDatasetInsightsOptions;
}

export const DemoPageTemplate: React.FC<DemoPageTemplateProps> = ({
  title,
  description,
  datasetId,
  columns,
  chartComponent,
  fallbackData = [],
  dataLoader,
  chunkSize = 100,
  insightsConfig
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [filterText, setFilterText] = useState('');
  const { i18n } = useLingui();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const resolvedLoader = useCallback(async (chunk: number, size: number) => {
    if (dataLoader) {
      // Note: dataLoader filtering is not supported in this simplified implementation
      // It would require passing filterText to dataLoader
      return dataLoader(chunk, size);
    }

    if (fallbackData.length > 0) {
      let filteredData = fallbackData;
      if (filterText) {
        const lowerFilter = filterText.toLowerCase();
        filteredData = fallbackData.filter(row =>
          Object.values(row).some(val =>
            String(val).toLowerCase().includes(lowerFilter)
          )
        );
      }

      const start = chunk * size;
      const end = start + size;
      return {
        data: filteredData.slice(start, end),
        total: filteredData.length
      };
    }

    return { data: [], total: 0 };
  }, [dataLoader, fallbackData, filterText]);

  // Data loading with progressive loader
  const {
    data,
    loading: dataLoading,
    progress,
    hasMore,
    loadNext,
    error: dataError,
    reset,
  } = useProgressiveData(resolvedLoader, { chunkSize });

  // Reset data loader when source or filter changes
  const loaderKey = useMemo(() => `${fallbackData?.length || 0}-${!!dataLoader}-${filterText}`, [fallbackData?.length, dataLoader, filterText]);
  useEffect(() => {
    reset();
  }, [reset, loaderKey]);

  // AI Insights
  const {
    insights,
    loading: insightsLoading,
    error: insightsError,
    refresh: refreshInsights
  } = useDatasetInsights(datasetId, insightsConfig);

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
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', gap: 2 }}>
               <TextField
                size="small"
                placeholder={i18n._(defineMessage({ message: "Search data..." }))}
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 300 }}
              />
            </Box>
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
                    {data.length} rows loaded
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

import { Trans } from '@lingui/macro';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import React, { useMemo, useState } from 'react';

import { Insight, InsightCard } from './InsightCard';
import { Severity } from './SeverityIndicator';

interface InsightsPanelProps {
  insights: Insight[];
  loading?: boolean;
  error?: Error | null;
  onRefresh?: () => void;
  locale?: 'en' | 'sr';
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({
  insights,
  loading = false,
  error = null,
  onRefresh,
  locale = 'sr'
}) => {
  const [filter, setFilter] = useState<Severity | 'all'>('all');

  const filteredInsights = useMemo(() => {
    if (filter === 'all') return insights;
    return insights.filter(i => i.severity === filter);
  }, [insights, filter]);

  const counts = useMemo(() => {
    return {
      all: insights.length,
      info: insights.filter(i => i.severity === 'info').length,
      warning: insights.filter(i => i.severity === 'warning').length,
      critical: insights.filter(i => i.severity === 'critical').length,
    };
  }, [insights]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" action={
        onRefresh && <Button color="inherit" size="small" onClick={onRefresh}>Retry</Button>
      }>
        {error.message}
      </Alert>
    );
  }

  if (insights.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
        <AutoAwesomeIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
        <Typography variant="h6" color="text.secondary">
          <Trans>No insights found</Trans>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <Trans>Try adding more data to generate insights.</Trans>
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesomeIcon color="primary" />
          <Typography variant="h6">
            <Trans>AI Insights</Trans>
          </Typography>
          <Chip
            label={insights.length}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ ml: 1 }}
          />
        </Box>

        {onRefresh && (
          <Button
            startIcon={<RefreshIcon />}
            size="small"
            onClick={onRefresh}
          >
            <Trans>Refresh</Trans>
          </Button>
        )}
      </Box>

      {/* Filters */}
      <Stack direction="row" spacing={1} sx={{ mb: 3, overflowX: 'auto', pb: 1 }}>
        <Chip
          icon={<FilterListIcon />}
          label={<Trans>All</Trans>}
          onClick={() => setFilter('all')}
          variant={filter === 'all' ? 'filled' : 'outlined'}
          color={filter === 'all' ? 'primary' : 'default'}
        />
        {counts.critical > 0 && (
          <Chip
            label={<Trans>Critical</Trans>}
            onClick={() => setFilter('critical')}
            variant={filter === 'critical' ? 'filled' : 'outlined'}
            color="error"
            size="small"
          />
        )}
        {counts.warning > 0 && (
          <Chip
            label={<Trans>Warnings</Trans>}
            onClick={() => setFilter('warning')}
            variant={filter === 'warning' ? 'filled' : 'outlined'}
            color="warning"
            size="small"
          />
        )}
        {counts.info > 0 && (
          <Chip
            label={<Trans>Info</Trans>}
            onClick={() => setFilter('info')}
            variant={filter === 'info' ? 'filled' : 'outlined'}
            color="info"
            size="small"
          />
        )}
      </Stack>

      {/* Insights List */}
      <Stack spacing={0}>
        {filteredInsights.map((insight, index) => (
          <InsightCard
            key={index}
            insight={insight}
            locale={locale}
          />
        ))}
      </Stack>
    </Box>
  );
};

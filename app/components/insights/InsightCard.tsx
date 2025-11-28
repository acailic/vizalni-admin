import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Collapse,
  IconButton,
  Stack,
  useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { SeverityIndicator, Severity } from './SeverityIndicator';
import { RecommendationBadge } from './RecommendationBadge';
import { Trans } from '@lingui/macro';

export interface Insight {
  type: 'trend' | 'anomaly' | 'correlation';
  subtype?: string;
  severity: Severity;
  message: {
    en: string;
    sr: string;
  };
  data?: any;
  recommendations?: Array<{
    en: string;
    sr: string;
  }>;
}

interface InsightCardProps {
  insight: Insight;
  locale: 'en' | 'sr';
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight, locale }) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  const getIcon = () => {
    if (insight.type === 'trend') {
      if (insight.data?.direction === 'increasing') return <TrendingUpIcon />;
      if (insight.data?.direction === 'decreasing') return <TrendingDownIcon />;
      return <ShowChartIcon />;
    }
    if (insight.type === 'anomaly') return <WarningAmberIcon />;
    if (insight.type === 'correlation') return <CompareArrowsIcon />;
    return <ShowChartIcon />;
  };

  const getTitle = () => {
    if (insight.type === 'trend') return <Trans>Trend Detected</Trans>;
    if (insight.type === 'anomaly') return <Trans>Anomaly Detected</Trans>;
    if (insight.type === 'correlation') return <Trans>Correlation Found</Trans>;
    return <Trans>Insight</Trans>;
  };

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        borderColor: insight.severity === 'critical' ? theme.palette.error.light : undefined,
        borderWidth: insight.severity === 'critical' ? 2 : 1
      }}
    >
      <CardContent sx={{ pb: expanded ? 0 : 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box
              sx={{
                p: 1,
                borderRadius: 1,
                bgcolor: theme.palette.action.hover,
                color: theme.palette.primary.main
              }}
            >
              {getIcon()}
            </Box>
            <Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 0.5 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
                  {getTitle()}
                </Typography>
                <SeverityIndicator severity={insight.severity} size="small" />
              </Box>
              <Typography variant="body1" fontWeight={500}>
                {insight.message[locale]}
              </Typography>
            </Box>
          </Box>

          {(insight.recommendations && insight.recommendations.length > 0) || insight.data ? (
            <IconButton
              onClick={() => setExpanded(!expanded)}
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s'
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          ) : null}
        </Box>
      </CardContent>

      <Collapse in={expanded}>
        <CardContent sx={{ pt: 0 }}>
          <Stack spacing={2} sx={{ mt: 2 }}>
            {/* Data Details */}
            {insight.data && (
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: theme.palette.action.hover,
                  borderRadius: 1,
                  fontSize: '0.875rem',
                  fontFamily: 'monospace'
                }}
              >
                {Object.entries(insight.data).map(([key, value]) => (
                  <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: theme.palette.text.secondary }}>{key}:</span>
                    <span>{String(value)}</span>
                  </Box>
                ))}
              </Box>
            )}

            {/* Recommendations */}
            {insight.recommendations && insight.recommendations.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  <Trans>Recommendations</Trans>
                </Typography>
                <Stack spacing={1}>
                  {insight.recommendations.map((rec, index) => (
                    <RecommendationBadge key={index} text={rec[locale]} />
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Collapse>
    </Card>
  );
};

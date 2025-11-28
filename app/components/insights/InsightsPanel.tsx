import { Grid, Typography, Box } from '@mui/material';

import type { Insight } from '@/lib/insights/types';

import { InsightCard } from './InsightCard';

interface Props {
  insights: Insight[];
  title?: string;
  locale?: 'sr' | 'en';
}

export function InsightsPanel({ insights, title, locale = 'sr' }: Props) {
  if (!insights.length) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        {title || 'AI uvidi'}
      </Typography>
      <Grid container spacing={2}>
        {insights.map((insight) => (
          <Grid item xs={12} sm={6} md={4} key={insight.id}>
            <InsightCard insight={insight} locale={locale} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

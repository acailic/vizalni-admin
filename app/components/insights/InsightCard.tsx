import { Card, CardContent, Stack, Typography } from '@mui/material';

import type { Insight } from '@/lib/insights/types';
import { SeverityIndicator } from './SeverityIndicator';
import { RecommendationBadge } from './RecommendationBadge';

interface Props {
  insight: Insight;
  locale?: 'sr' | 'en';
}

export function InsightCard({ insight, locale = 'sr' }: Props) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <SeverityIndicator severity={insight.severity} locale={locale} />
          <Typography variant="overline" color="text.secondary">
            {insight.type.toUpperCase()}
          </Typography>
        </Stack>

        <Typography variant="h6" sx={{ mb: 1 }}>
          {insight.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {insight.description}
        </Typography>

        {insight.metric && (
          <Typography variant="caption" color="text.secondary">
            {insight.metric} {insight.value !== undefined ? `• ${insight.value}` : ''}
            {insight.evidence ? ` • ${insight.evidence}` : ''}
          </Typography>
        )}

        <RecommendationBadge text={insight.recommendation} />
      </CardContent>
    </Card>
  );
}

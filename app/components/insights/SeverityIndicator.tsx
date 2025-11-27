import { Chip } from '@mui/material';

import type { InsightSeverity } from '@/lib/insights/types';

interface Props {
  severity: InsightSeverity;
  locale?: 'sr' | 'en';
}

export function SeverityIndicator({ severity, locale = 'sr' }: Props) {
  const color =
    severity === 'critical'
      ? 'error'
      : severity === 'warning'
        ? 'warning'
        : 'default';

  const label =
    severity === 'critical'
      ? locale === 'sr'
        ? 'Kritično'
        : 'Critical'
      : severity === 'warning'
        ? locale === 'sr'
          ? 'Upozorenje'
          : 'Warning'
        : locale === 'sr'
          ? 'Info'
          : 'Info';

  return <Chip size="small" color={color} label={label} />;
}

import { Trans } from '@lingui/macro';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import { Box, Chip, useTheme } from '@mui/material';
import React from 'react';

export type Severity = 'info' | 'warning' | 'critical';

interface SeverityIndicatorProps {
  severity: Severity;
  showLabel?: boolean;
  size?: 'small' | 'medium';
}

export const SeverityIndicator: React.FC<SeverityIndicatorProps> = ({
  severity,
  showLabel = true,
  size = 'small'
}) => {
  const theme = useTheme();

  const config = {
    info: {
      color: theme.palette.info.main,
      bg: theme.palette.info.light,
      icon: <InfoIcon fontSize="small" />,
      label: <Trans>Info</Trans>
    },
    warning: {
      color: theme.palette.warning.main,
      bg: theme.palette.warning.light,
      icon: <WarningIcon fontSize="small" />,
      label: <Trans>Warning</Trans>
    },
    critical: {
      color: theme.palette.error.main,
      bg: theme.palette.error.light,
      icon: <ErrorIcon fontSize="small" />,
      label: <Trans>Critical</Trans>
    }
  };

  const { color, icon, label } = config[severity];

  if (!showLabel) {
    return (
      <Box sx={{ color, display: 'flex', alignItems: 'center' }}>
        {icon}
      </Box>
    );
  }

  return (
    <Chip
      icon={icon}
      label={label}
      size={size}
      sx={{
        backgroundColor: `${color}20`, // 12% opacity
        color: color,
        fontWeight: 600,
        '& .MuiChip-icon': {
          color: color
        }
      }}
    />
  );
};

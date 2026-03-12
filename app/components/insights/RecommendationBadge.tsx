import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';

interface RecommendationBadgeProps {
  text: string;
}

export const RecommendationBadge: React.FC<RecommendationBadgeProps> = ({ text }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1,
        p: 1.5,
        borderRadius: 1,
        backgroundColor: theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(0, 0, 0, 0.03)',
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <LightbulbIcon
        fontSize="small"
        sx={{
          color: theme.palette.warning.main,
          mt: 0.3
        }}
      />
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
    </Box>
  );
};

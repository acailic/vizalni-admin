import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import React from 'react';

import { VizualniAdminConfig } from '@/lib/config/types';

interface LivePreviewProps {
  config: VizualniAdminConfig;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ config }) => {
  return (
    <Card variant="outlined">
      <CardHeader title="Live preview" subheader="Current configuration JSON" />
      <CardContent>
        <Typography
          component="pre"
          sx={{
            fontFamily: 'monospace',
            fontSize: 13,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            m: 0,
          }}
        >
          {JSON.stringify(config, null, 2)}
        </Typography>
      </CardContent>
    </Card>
  );
};

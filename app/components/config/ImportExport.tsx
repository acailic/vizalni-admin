import { Download, Upload } from '@mui/icons-material';
import { Button, Stack, Typography } from '@mui/material';
import React, { useRef } from 'react';

interface ImportExportProps {
  onImport: (jsonText: string) => void;
  onExport: () => void;
}

export const ImportExport: React.FC<ImportExportProps> = ({ onImport, onExport }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        onImport(text);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const triggerImport = () => {
    fileInputRef.current?.click();
  };

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
      <input
        type="file"
        accept="application/json"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Button variant="outlined" startIcon={<Upload />} onClick={triggerImport}>
        Import JSON
      </Button>
      <Button variant="contained" startIcon={<Download />} onClick={onExport}>
        Export JSON
      </Button>
      <Typography variant="body2" color="text.secondary">
        Import will validate the file before applying.
      </Typography>
    </Stack>
  );
};

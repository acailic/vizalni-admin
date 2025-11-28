import { Alert, Box, Container, Paper, Stack, Typography, Button } from '@mui/material';
import React, { useMemo, useState } from 'react';

import { ConfigEditor } from '@/components/config/ConfigEditor';
import { ImportExport } from '@/components/config/ImportExport';
import { LivePreview } from '@/components/config/LivePreview';
import { ValidationErrors } from '@/components/config/ValidationErrors';
import { DEFAULT_CONFIG } from '@/lib/config/defaults';
import { VizualniAdminConfig } from '@/lib/config/types';
import { validateConfig } from '@/lib/config/validator';

const ConfigPage: React.FC = () => {
  const [config, setConfig] = useState<VizualniAdminConfig>(DEFAULT_CONFIG);
  const [importError, setImportError] = useState<string | null>(null);

  const validation = useMemo(() => validateConfig(config), [config]);
  const validationErrors = validation.valid ? [] : validation.errors;

  const handleImport = (jsonText: string) => {
    setImportError(null);
    try {
      const parsed = JSON.parse(jsonText);
      const result = validateConfig(parsed);
      if (result.valid) {
        setConfig(result.data);
      } else {
        setImportError('Imported configuration is invalid. See errors below.');
      }
    } catch (error) {
      setImportError('Could not parse JSON file.');
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'vizualni-admin.config.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Configuration
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Edit, validate, import, and export Vizualni Admin configuration. Validation runs automatically as you edit.
          </Typography>
        </Box>

        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            <ImportExport onImport={handleImport} onExport={handleExport} />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button variant="outlined" onClick={handleReset}>
                Reset to defaults
              </Button>
              {!validation.valid && (
                <Alert severity="warning" sx={{ flex: 1 }}>
                  Current configuration has validation errors.
                </Alert>
              )}
            </Stack>
            {importError && <Alert severity="error">{importError}</Alert>}
            <ValidationErrors errors={validationErrors} />
          </Stack>
        </Paper>

        <ConfigEditor value={config} onChange={setConfig} />
        <LivePreview config={config} />
      </Stack>
    </Container>
  );
};

export default ConfigPage;

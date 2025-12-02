import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import React, { useMemo, useState } from 'react';

import { VizualniAdminConfig } from '@/lib/config/types';

interface ConfigEditorProps {
  value: VizualniAdminConfig;
  onChange: (next: VizualniAdminConfig) => void;
}

const parseList = (text: string): string[] =>
  text
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

export const ConfigEditor: React.FC<ConfigEditorProps> = ({ value, onChange }) => {
  const [manualIdsText, setManualIdsText] = useState<string>(JSON.stringify(value.datasets.manualIds, null, 2));
  const [manualIdsError, setManualIdsError] = useState<string | null>(null);

  const categoryEnabledText = useMemo(() => value.categories.enabled.join(', '), [value.categories.enabled]);
  const categoryFeaturedText = useMemo(() => value.categories.featured.join(', '), [value.categories.featured]);

  const updateConfig = (updates: Partial<VizualniAdminConfig>) => {
    onChange({ ...value, ...updates });
  };

  const updateProject = (updates: Partial<VizualniAdminConfig['project']>) => {
    updateConfig({ project: { ...value.project, ...updates } });
  };

  const updateCategories = (updates: Partial<VizualniAdminConfig['categories']>) => {
    updateConfig({ categories: { ...value.categories, ...updates } });
  };

  const updateDatasets = (updates: Partial<VizualniAdminConfig['datasets']>) => {
    updateConfig({ datasets: { ...value.datasets, ...updates } });
  };

  const updateVisualization = (updates: Partial<VizualniAdminConfig['visualization']>) => {
    updateConfig({ visualization: { ...value.visualization, ...updates } });
  };

  const updateFeatures = (updates: Partial<VizualniAdminConfig['features']>) => {
    updateConfig({ features: { ...value.features, ...updates } });
  };

  const updateDeployment = (updates: Partial<VizualniAdminConfig['deployment']>) => {
    updateConfig({ deployment: { ...value.deployment, ...updates } });
  };

  const handleManualIdsBlur = () => {
    try {
      const parsed = JSON.parse(manualIdsText);
      if (parsed && typeof parsed === 'object') {
        setManualIdsError(null);
        updateDatasets({ manualIds: parsed as Record<string, string[]> });
      } else {
        setManualIdsError('Manual IDs must be an object mapping categories to string arrays.');
      }
    } catch (error) {
      setManualIdsError('Invalid JSON. Please fix and try again.');
    }
  };

  return (
    <Stack spacing={3}>
      <Card variant="outlined">
        <CardHeader title="Project" subheader="Basic project details" />
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="Project name"
              value={value.project.name}
              onChange={(e) => updateProject({ name: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="language-label">Language</InputLabel>
              <Select
                labelId="language-label"
                label="Language"
                value={value.project.language}
                onChange={(e) => updateProject({ language: e.target.value as VizualniAdminConfig['project']['language'] })}
              >
                <MenuItem value="sr">Serbian</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="theme-label">Theme</InputLabel>
              <Select
                labelId="theme-label"
                label="Theme"
                value={value.project.theme}
                onChange={(e) => updateProject({ theme: e.target.value as VizualniAdminConfig['project']['theme'] })}
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardHeader title="Categories" subheader="Enable and feature categories" />
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="Enabled categories (comma separated)"
              value={categoryEnabledText}
              onChange={(e) => updateCategories({ enabled: parseList(e.target.value) })}
              fullWidth
            />
            <TextField
              label="Featured categories (comma separated)"
              value={categoryFeaturedText}
              onChange={(e) => updateCategories({ featured: parseList(e.target.value) })}
              fullWidth
            />
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardHeader title="Datasets" subheader="Discovery and manual IDs" />
        <CardContent>
          <Stack spacing={2}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={value.datasets.autoDiscovery}
                    onChange={(e) => updateDatasets({ autoDiscovery: e.target.checked })}
                  />
                }
                label="Enable automatic discovery"
              />
            </FormGroup>
            <TextField
              label="Manual dataset IDs (JSON object)"
              value={manualIdsText}
              onChange={(e) => setManualIdsText(e.target.value)}
              onBlur={handleManualIdsBlur}
              multiline
              minRows={4}
              helperText={manualIdsError ?? 'Example: { "air-quality": ["id1", "id2"] }'}
              error={Boolean(manualIdsError)}
              fullWidth
            />
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardHeader title="Visualization" subheader="Chart defaults and colors" />
        <CardContent>
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="chart-type-label">Default chart type</InputLabel>
              <Select
                labelId="chart-type-label"
                label="Default chart type"
                value={value.visualization.defaultChartType}
                onChange={(e) =>
                  updateVisualization({
                    defaultChartType: e.target.value as VizualniAdminConfig['visualization']['defaultChartType'],
                  })
                }
              >
                <MenuItem value="bar">Bar</MenuItem>
                <MenuItem value="line">Line</MenuItem>
                <MenuItem value="area">Area</MenuItem>
                <MenuItem value="pie">Pie</MenuItem>
                <MenuItem value="map">Map</MenuItem>
                <MenuItem value="table">Table</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Color palette"
              value={value.visualization.colorPalette}
              onChange={(e) => updateVisualization({ colorPalette: e.target.value })}
              fullWidth
            />
            <TextField
              label="Custom colors (comma separated hex)"
              value={value.visualization.customColors.join(', ')}
              onChange={(e) =>
                updateVisualization({
                  customColors: parseList(e.target.value),
                })
              }
              helperText="Use hex values like #1976d2"
              fullWidth
            />
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardHeader title="Features" subheader="Toggle optional features" />
        <CardContent>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={value.features.embedding}
                  onChange={(e) => updateFeatures({ embedding: e.target.checked })}
                />
              }
              label="Embedding"
            />
            <FormControlLabel
              control={
                <Switch checked={value.features.export} onChange={(e) => updateFeatures({ export: e.target.checked })} />
              }
              label="Export"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={value.features.sharing}
                  onChange={(e) => updateFeatures({ sharing: e.target.checked })}
                />
              }
              label="Sharing"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={value.features.tutorials}
                  onChange={(e) => updateFeatures({ tutorials: e.target.checked })}
                />
              }
              label="Tutorials"
            />
          </FormGroup>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardHeader title="Deployment" subheader="Hosting settings" />
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="Base path"
              value={value.deployment.basePath}
              onChange={(e) => updateDeployment({ basePath: e.target.value })}
              fullWidth
            />
            <TextField
              label="Custom domain"
              value={value.deployment.customDomain}
              onChange={(e) => updateDeployment({ customDomain: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="deployment-target-label">Deployment target</InputLabel>
              <Select
                labelId="deployment-target-label"
                label="Deployment target"
                value={value.deployment.target}
                onChange={(e) =>
                  updateDeployment({
                    target: e.target.value as VizualniAdminConfig['deployment']['target'],
                  })
                }
              >
                <MenuItem value="local">Local</MenuItem>
                <MenuItem value="github-pages">GitHub Pages</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </CardContent>
      </Card>

      <Box>
        <Divider sx={{ my: 1 }} />
        <Typography variant="body2" color="text.secondary">
          Changes are validated automatically. Invalid JSON in manual IDs will not be applied until fixed.
        </Typography>
      </Box>
    </Stack>
  );
};

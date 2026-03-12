/**
 * ThemeCustomization - Step 5 of onboarding wizard
 *
 * Features:
 * - Choose theme mode (light/dark/custom)
 * - Select primary and secondary colors
 * - Live preview of theme
 * - Preset color palettes
 */

import {
  ArrowBack,
  ArrowForward,
  LightMode,
  DarkMode,
  Palette,
  CheckCircle,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Button,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
  Paper,
} from '@mui/material';
import React from 'react';

interface ThemeCustomizationProps {
  theme: {
    mode: 'light' | 'dark' | 'custom';
    primaryColor?: string;
    secondaryColor?: string;
  };
  onUpdate: (theme: {
    mode: 'light' | 'dark' | 'custom';
    primaryColor?: string;
    secondaryColor?: string;
  }) => void;
  onNext: () => void;
  onBack: () => void;
  language: 'sr' | 'en';
}

const colorPresets = [
  { name: 'Blue', primary: '#1976d2', secondary: '#dc004e' },
  { name: 'Green', primary: '#388e3c', secondary: '#f57c00' },
  { name: 'Purple', primary: '#7b1fa2', secondary: '#0288d1' },
  { name: 'Red', primary: '#d32f2f', secondary: '#303f9f' },
  { name: 'Teal', primary: '#00796b', secondary: '#c2185b' },
  { name: 'Orange', primary: '#f57c00', secondary: '#1976d2' },
];

export const ThemeCustomization: React.FC<ThemeCustomizationProps> = ({
  theme,
  onUpdate,
  onNext,
  onBack,
  language,
}) => {
  const handleModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: 'light' | 'dark' | 'custom' | null
  ) => {
    if (newMode !== null) {
      onUpdate({ ...theme, mode: newMode });
    }
  };

  const handleColorPreset = (primary: string, secondary: string) => {
    onUpdate({
      ...theme,
      mode: 'custom',
      primaryColor: primary,
      secondaryColor: secondary,
    });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Header */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 1 }}>
        {language === 'sr' ? 'Прилагодите тему' : 'Customize Theme'}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {language === 'sr'
          ? 'Одаберите изглед ваше апликације'
          : 'Choose the appearance of your application'}
      </Typography>

      {/* Theme Mode Selection */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {language === 'sr' ? 'Режим теме' : 'Theme Mode'}
        </Typography>
        <ToggleButtonGroup
          value={theme.mode}
          exclusive
          onChange={handleModeChange}
          aria-label="theme mode"
          fullWidth
          sx={{ mb: 2 }}
        >
          <ToggleButton value="light" aria-label="light mode">
            <LightMode sx={{ mr: 1 }} />
            {language === 'sr' ? 'Светла' : 'Light'}
          </ToggleButton>
          <ToggleButton value="dark" aria-label="dark mode">
            <DarkMode sx={{ mr: 1 }} />
            {language === 'sr' ? 'Тамна' : 'Dark'}
          </ToggleButton>
          <ToggleButton value="custom" aria-label="custom theme">
            <Palette sx={{ mr: 1 }} />
            {language === 'sr' ? 'Прилагођена' : 'Custom'}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Color Presets (shown when custom mode is selected) */}
      {theme.mode === 'custom' && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {language === 'sr' ? 'Палета боја' : 'Color Palette'}
          </Typography>
          <Grid container spacing={2}>
            {colorPresets.map((preset) => {
              const isSelected =
                theme.primaryColor === preset.primary &&
                theme.secondaryColor === preset.secondary;

              return (
                <Grid item xs={6} sm={4} key={preset.name}>
                  <Card
                    elevation={isSelected ? 8 : 2}
                    sx={{
                      border: isSelected ? 2 : 0,
                      borderColor: 'primary.main',
                      position: 'relative',
                    }}
                  >
                    <CardActionArea
                      onClick={() => handleColorPreset(preset.primary, preset.secondary)}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        {isSelected && (
                          <CheckCircle
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              color: 'primary.main',
                              fontSize: 24,
                            }}
                          />
                        )}
                        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 1 }}>
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              bgcolor: preset.primary,
                              borderRadius: 1,
                              border: 1,
                              borderColor: 'divider',
                            }}
                          />
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              bgcolor: preset.secondary,
                              borderRadius: 1,
                              border: 1,
                              borderColor: 'divider',
                            }}
                          />
                        </Stack>
                        <Typography variant="body2">{preset.name}</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}

      {/* Theme Preview */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {language === 'sr' ? 'Преглед' : 'Preview'}
        </Typography>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            bgcolor: theme.mode === 'dark' ? 'grey.900' : 'background.paper',
            color: theme.mode === 'dark' ? 'grey.100' : 'text.primary',
          }}
        >
          <Typography variant="h5" gutterBottom>
            {language === 'sr' ? 'Пример наслова' : 'Sample Heading'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {language === 'sr'
              ? 'Ово је пример како ће изгледати ваша апликација са изабраном темом.'
              : 'This is an example of how your application will look with the selected theme.'}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              sx={{
                bgcolor: theme.mode === 'custom' ? theme.primaryColor : undefined,
                '&:hover': {
                  bgcolor: theme.mode === 'custom' ? theme.primaryColor : undefined,
                  opacity: 0.9,
                },
              }}
            >
              {language === 'sr' ? 'Примарно' : 'Primary'}
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: theme.mode === 'custom' ? theme.secondaryColor : undefined,
                color: theme.mode === 'custom' ? theme.secondaryColor : undefined,
              }}
            >
              {language === 'sr' ? 'Секундарно' : 'Secondary'}
            </Button>
          </Stack>
        </Paper>
      </Box>

      {/* Navigation Buttons */}
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button
          variant="outlined"
          onClick={onBack}
          startIcon={<ArrowBack />}
          sx={{ minWidth: 120 }}
        >
          {language === 'sr' ? 'Назад' : 'Back'}
        </Button>

        <Button
          variant="contained"
          onClick={onNext}
          endIcon={<ArrowForward />}
          sx={{ minWidth: 120 }}
        >
          {language === 'sr' ? 'Даље' : 'Next'}
        </Button>
      </Stack>
    </Box>
  );
};

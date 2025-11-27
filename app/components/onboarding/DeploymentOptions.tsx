/**
 * DeploymentOptions - Step 6 (Final) of onboarding wizard
 *
 * Features:
 * - Choose deployment method (local/GitHub Pages/custom)
 * - Configure deployment settings
 * - Review all wizard selections
 * - Generate and download configuration file
 * - Show next steps
 */

import {
  ArrowBack,
  Computer,
  Cloud,
  Settings,
  CheckCircle,
  ExpandMore,
  Download,
  Language as LanguageIcon,
  Category,
  DataObject,
  Palette,
  Rocket,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Button,
  Stack,
  TextField,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import React, { useState } from 'react';

interface DeploymentOptionsProps {
  deployment: {
    type: 'local' | 'github-pages' | 'custom';
    basePath?: string;
    customDomain?: string;
  };
  onUpdate: (deployment: {
    type: 'local' | 'github-pages' | 'custom';
    basePath?: string;
    customDomain?: string;
  }) => void;
  data: {
    language: 'sr' | 'en';
    categories: string[];
    datasets: { [category: string]: string[] };
    theme: {
      mode: 'light' | 'dark' | 'custom';
      primaryColor?: string;
      secondaryColor?: string;
    };
    deployment: {
      type: 'local' | 'github-pages' | 'custom';
      basePath?: string;
      customDomain?: string;
    };
  };
  onBack: () => void;
  language: 'sr' | 'en';
}

const deploymentTypes = [
  {
    type: 'local' as const,
    icon: Computer,
    name: { sr: 'Локално', en: 'Local' },
    description: {
      sr: 'Покрените локално за развој и тестирање',
      en: 'Run locally for development and testing',
    },
  },
  {
    type: 'github-pages' as const,
    icon: Cloud,
    name: { sr: 'GitHub Pages', en: 'GitHub Pages' },
    description: {
      sr: 'Објавите бесплатно на GitHub Pages',
      en: 'Deploy for free on GitHub Pages',
    },
  },
  {
    type: 'custom' as const,
    icon: Settings,
    name: { sr: 'Прилагођено', en: 'Custom' },
    description: {
      sr: 'Прилагођена конфигурација за сопствени сервер',
      en: 'Custom configuration for your own server',
    },
  },
];

export const DeploymentOptions: React.FC<DeploymentOptionsProps> = ({
  deployment,
  onUpdate,
  data,
  onBack,
  language,
}) => {
  const [downloadReady, setDownloadReady] = useState(false);

  const handleTypeChange = (type: 'local' | 'github-pages' | 'custom') => {
    onUpdate({ ...deployment, type });
  };

  const generateConfig = () => {
    const config = {
      version: '1.0.0',
      language: data.language,
      categories: data.categories,
      datasets: data.datasets,
      theme: data.theme,
      deployment: deployment,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vizualni-admin-config.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadReady(true);
  };

  const totalDatasets = Object.values(data.datasets).reduce(
    (sum, datasets) => sum + datasets.length,
    0
  );

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Header */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 1 }}>
        {language === 'sr' ? 'Обjavljivање' : 'Deployment'}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {language === 'sr'
          ? 'Изаберите како ћете објавити вашу апликацију'
          : 'Choose how you will deploy your application'}
      </Typography>

      {/* Deployment Type Selection */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 2,
          mb: 4,
        }}
      >
        {deploymentTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = deployment.type === type.type;

          return (
            <Card
              key={type.type}
              elevation={isSelected ? 8 : 2}
              sx={{
                border: isSelected ? 2 : 0,
                borderColor: 'primary.main',
                position: 'relative',
              }}
            >
              <CardActionArea onClick={() => handleTypeChange(type.type)}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
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
                  <Icon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6" gutterBottom>
                    {type.name[language]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {type.description[language]}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
      </Box>

      {/* Deployment-specific Configuration */}
      {deployment.type === 'github-pages' && (
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            label={language === 'sr' ? 'Основна путања' : 'Base Path'}
            placeholder="/my-project"
            value={deployment.basePath || ''}
            onChange={(e) => onUpdate({ ...deployment, basePath: e.target.value })}
            helperText={
              language === 'sr'
                ? 'Путања вашег GitHub репозиторијума (нпр. /my-repo)'
                : 'Path to your GitHub repository (e.g., /my-repo)'
            }
          />
        </Box>
      )}

      {deployment.type === 'custom' && (
        <Box sx={{ mb: 4 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label={language === 'sr' ? 'Домен' : 'Domain'}
              placeholder="example.com"
              value={deployment.customDomain || ''}
              onChange={(e) => onUpdate({ ...deployment, customDomain: e.target.value })}
              helperText={
                language === 'sr'
                  ? 'Ваш домен (опционално)'
                  : 'Your custom domain (optional)'
              }
            />
            <TextField
              fullWidth
              label={language === 'sr' ? 'Основна путања' : 'Base Path'}
              placeholder="/app"
              value={deployment.basePath || ''}
              onChange={(e) => onUpdate({ ...deployment, basePath: e.target.value })}
              helperText={
                language === 'sr' ? 'Путања на серверу' : 'Path on your server'
              }
            />
          </Stack>
        </Box>
      )}

      {/* Configuration Summary */}
      <Accordion defaultExpanded sx={{ mb: 4 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">
            {language === 'sr' ? 'Преглед конфигурације' : 'Configuration Summary'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem>
              <ListItemIcon>
                <LanguageIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={language === 'sr' ? 'Језик' : 'Language'}
                secondary={data.language === 'sr' ? 'Српски' : 'English'}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <Category color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={language === 'sr' ? 'Категорије' : 'Categories'}
                secondary={
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
                    {data.categories.map((cat) => (
                      <Chip key={cat} label={cat} size="small" sx={{ mb: 0.5 }} />
                    ))}
                  </Stack>
                }
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <DataObject color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={language === 'sr' ? 'Подаци' : 'Datasets'}
                secondary={
                  language === 'sr'
                    ? `${totalDatasets} ${totalDatasets === 1 ? 'податак' : 'података'} одабрано`
                    : `${totalDatasets} dataset${totalDatasets !== 1 ? 's' : ''} selected`
                }
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <Palette color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={language === 'sr' ? 'Тема' : 'Theme'}
                secondary={
                  data.theme.mode === 'light'
                    ? language === 'sr'
                      ? 'Светла'
                      : 'Light'
                    : data.theme.mode === 'dark'
                    ? language === 'sr'
                      ? 'Тамна'
                      : 'Dark'
                    : language === 'sr'
                    ? 'Прилагођена'
                    : 'Custom'
                }
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Download Configuration */}
      <Card sx={{ mb: 4, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
        <CardContent>
          <Stack spacing={2} alignItems="center">
            <Download sx={{ fontSize: 48 }} />
            <Typography variant="h6" textAlign="center">
              {language === 'sr' ? 'Преузмите конфигурацију' : 'Download Configuration'}
            </Typography>
            <Typography variant="body2" textAlign="center">
              {language === 'sr'
                ? 'Преузмите JSON фајл са вашим подешавањима'
                : 'Download the JSON file with your settings'}
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={generateConfig}
              startIcon={<Download />}
              sx={{
                bgcolor: 'background.paper',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              {language === 'sr' ? 'Преузми конфигурацију' : 'Download Config'}
            </Button>
            {downloadReady && (
              <Alert severity="success" sx={{ width: '100%' }}>
                {language === 'sr'
                  ? 'Конфигурација успешно преузета!'
                  : 'Configuration downloaded successfully!'}
              </Alert>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Alert severity="info" icon={<Rocket />} sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          {language === 'sr' ? 'Следећи кораци:' : 'Next Steps:'}
        </Typography>
        <List dense>
          <ListItem>
            <Typography variant="body2">
              1.{' '}
              {language === 'sr'
                ? 'Преузмите конфигурациони фајл'
                : 'Download the configuration file'}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body2">
              2.{' '}
              {language === 'sr'
                ? 'Ставите га у главни директоријум пројекта'
                : 'Place it in your project root directory'}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body2">
              3.{' '}
              {language === 'sr'
                ? 'Покрените `npm run discover` за проналажење података'
                : 'Run `npm run discover` to find datasets'}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body2">
              4.{' '}
              {language === 'sr'
                ? 'Покрените `npm run dev` за развој или `npm run build` за продукцију'
                : 'Run `npm run dev` for development or `npm run build` for production'}
            </Typography>
          </ListItem>
        </List>
      </Alert>

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
          size="large"
          onClick={() => window.location.href = '/'}
          endIcon={<Rocket />}
          sx={{ minWidth: 120 }}
        >
          {language === 'sr' ? 'Завршите' : 'Finish'}
        </Button>
      </Stack>
    </Box>
  );
};

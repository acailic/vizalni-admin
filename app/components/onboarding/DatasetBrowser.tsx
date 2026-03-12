/**
 * DatasetBrowser - Step 4 of onboarding wizard
 *
 * Features:
 * - Browse available datasets by category
 * - Multi-select datasets within each category
 * - Preview dataset information
 * - Search and filter capabilities
 */

import {
  ArrowBack,
  ArrowForward,
  ExpandMore,
  Search,
  DataObject,
  CheckCircle,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  TextField,
  InputAdornment,
  Alert,
} from '@mui/material';
import React, { useState } from 'react';

interface DatasetBrowserProps {
  categories: string[];
  selected: { [category: string]: string[] };
  onSelect: (datasets: { [category: string]: string[] }) => void;
  onNext: () => void;
  onBack: () => void;
  language: 'sr' | 'en';
}

// Mock datasets - will be replaced with real data.gov.rs datasets from amplifier discovery
const mockDatasets: { [category: string]: Array<{ id: string; title: { sr: string; en: string }; description: { sr: string; en: string } }> } = {
  budget: [
    {
      id: 'budget-001',
      title: { sr: 'Државни буџет 2024', en: 'National Budget 2024' },
      description: { sr: 'Преглед државног буџета за 2024. годину', en: 'Overview of national budget for 2024' },
    },
    {
      id: 'budget-002',
      title: { sr: 'Локални буџети', en: 'Local Budgets' },
      description: { sr: 'Буџети локалних самоуправа', en: 'Municipal budgets' },
    },
  ],
  health: [
    {
      id: 'health-001',
      title: { sr: 'Здравствене установе', en: 'Healthcare Facilities' },
      description: { sr: 'Списак здравствених установа', en: 'List of healthcare facilities' },
    },
    {
      id: 'health-002',
      title: { sr: 'Вакцинација COVID-19', en: 'COVID-19 Vaccination' },
      description: { sr: 'Статистика вакцинације', en: 'Vaccination statistics' },
    },
  ],
  education: [
    {
      id: 'edu-001',
      title: { sr: 'Основне школе', en: 'Primary Schools' },
      description: { sr: 'Подаци о основним школама', en: 'Primary school data' },
    },
    {
      id: 'edu-002',
      title: { sr: 'Средње школе', en: 'Secondary Schools' },
      description: { sr: 'Подаци о средњим школама', en: 'Secondary school data' },
    },
  ],
  environment: [
    {
      id: 'env-001',
      title: { sr: 'Квалитет ваздуха', en: 'Air Quality' },
      description: { sr: 'Мерења квалитета ваздуха', en: 'Air quality measurements' },
    },
    {
      id: 'env-002',
      title: { sr: 'Квалитет воде', en: 'Water Quality' },
      description: { sr: 'Мерења квалитета воде', en: 'Water quality measurements' },
    },
  ],
  transport: [
    {
      id: 'transport-001',
      title: { sr: 'Јавни превоз Београд', en: 'Public Transport Belgrade' },
      description: { sr: 'Редови вожње и статистика', en: 'Schedules and statistics' },
    },
  ],
  economy: [
    {
      id: 'economy-001',
      title: { sr: 'БДП по регионима', en: 'GDP by Region' },
      description: { sr: 'Регионални економски подаци', en: 'Regional economic data' },
    },
  ],
  safety: [
    {
      id: 'safety-001',
      title: { sr: 'Статистика криминала', en: 'Crime Statistics' },
      description: { sr: 'Подаци о криминалу', en: 'Crime data' },
    },
  ],
  weather: [
    {
      id: 'weather-001',
      title: { sr: 'Временска статистика', en: 'Weather Statistics' },
      description: { sr: 'Историјски подаци о времену', en: 'Historical weather data' },
    },
  ],
  demographics: [
    {
      id: 'demo-001',
      title: { sr: 'Попис становништва', en: 'Population Census' },
      description: { sr: 'Подаци пописа', en: 'Census data' },
    },
  ],
  legal: [
    {
      id: 'legal-001',
      title: { sr: 'Закони и прописи', en: 'Laws and Regulations' },
      description: { sr: 'Правни акти', en: 'Legal documents' },
    },
  ],
  geo: [
    {
      id: 'geo-001',
      title: { sr: 'Географске границе', en: 'Geographic Boundaries' },
      description: { sr: 'Административне границе', en: 'Administrative boundaries' },
    },
  ],
};

export const DatasetBrowser: React.FC<DatasetBrowserProps> = ({
  categories,
  selected,
  onSelect,
  onNext,
  onBack,
  language,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | false>(
    categories.length > 0 ? categories[0] : false
  );

  const toggleDataset = (category: string, datasetId: string) => {
    const categoryDatasets = selected[category] || [];
    const newSelected = { ...selected };

    if (categoryDatasets.includes(datasetId)) {
      newSelected[category] = categoryDatasets.filter((id) => id !== datasetId);
    } else {
      newSelected[category] = [...categoryDatasets, datasetId];
    }

    onSelect(newSelected);
  };

  const totalSelected = Object.values(selected).reduce(
    (sum, datasets) => sum + datasets.length,
    0
  );

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Header */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 1 }}>
        {language === 'sr' ? 'Прегледајте податке' : 'Browse Datasets'}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {language === 'sr'
          ? 'Одаберите податке који ће бити доступни у вашој апликацији'
          : 'Select datasets that will be available in your application'}
      </Typography>

      {/* Search */}
      <TextField
        fullWidth
        placeholder={language === 'sr' ? 'Претражи податке...' : 'Search datasets...'}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {/* Selection Summary */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Chip
          icon={<CheckCircle />}
          label={
            language === 'sr'
              ? `Одабрано: ${totalSelected} ${totalSelected === 1 ? 'податак' : 'података'}`
              : `Selected: ${totalSelected} dataset${totalSelected !== 1 ? 's' : ''}`
          }
          color={totalSelected > 0 ? 'primary' : 'default'}
        />
      </Stack>

      {/* Info Alert */}
      <Alert severity="info" sx={{ mb: 3 }}>
        {language === 'sr'
          ? 'Ово су примери података. Након постављања, систем ће аутоматски открити реалне податке са data.gov.rs користећи Amplifier.'
          : 'These are example datasets. After setup, the system will automatically discover real datasets from data.gov.rs using Amplifier.'}
      </Alert>

      {/* Category Accordions */}
      {categories.length === 0 ? (
        <Alert severity="warning">
          {language === 'sr'
            ? 'Молимо вратите се и одаберите барем једну категорију'
            : 'Please go back and select at least one category'}
        </Alert>
      ) : (
        categories.map((category) => {
          const datasets = mockDatasets[category] || [];
          const categorySelected = selected[category] || [];

          return (
            <Accordion
              key={category}
              expanded={expandedCategory === category}
              onChange={(_, isExpanded) => setExpandedCategory(isExpanded ? category : false)}
              sx={{ mb: 1 }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                  <DataObject color="primary" />
                  <Typography sx={{ flexGrow: 1, textTransform: 'capitalize' }}>
                    {category}
                  </Typography>
                  <Chip
                    size="small"
                    label={`${categorySelected.length}/${datasets.length}`}
                    color={categorySelected.length > 0 ? 'primary' : 'default'}
                  />
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                {datasets.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    {language === 'sr'
                      ? 'Нема доступних података за ову категорију'
                      : 'No datasets available for this category'}
                  </Typography>
                ) : (
                  <Box>
                    {datasets.map((dataset) => (
                      <Card key={dataset.id} variant="outlined" sx={{ mb: 2 }}>
                        <CardContent>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={categorySelected.includes(dataset.id)}
                                onChange={() => toggleDataset(category, dataset.id)}
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="subtitle1">
                                  {dataset.title[language]}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {dataset.description[language]}
                                </Typography>
                              </Box>
                            }
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          );
        })
      )}

      {/* Navigation Buttons */}
      <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 4 }}>
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

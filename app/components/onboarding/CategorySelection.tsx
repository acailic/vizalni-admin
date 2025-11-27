/**
 * CategorySelection - Step 3 of onboarding wizard
 *
 * Features:
 * - Multi-select data categories from data.gov.rs
 * - Bilingual category names and descriptions
 * - Visual category cards with icons
 */

import {
  ArrowBack,
  ArrowForward,
  CheckCircle,
  AccountBalance,
  LocalHospital,
  School,
  Nature,
  DirectionsBus,
  Business,
  Security,
  WbSunny,
  Groups,
  Gavel,
  Public,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Button,
  Stack,
  Chip,
} from '@mui/material';
import React from 'react';

interface CategorySelectionProps {
  selected: string[];
  onSelect: (categories: string[]) => void;
  onNext: () => void;
  onBack: () => void;
  language: 'sr' | 'en';
}

const categories = [
  {
    id: 'budget',
    icon: AccountBalance,
    name: { sr: 'Буџет', en: 'Budget' },
    description: { sr: 'Државни буџет и финансије', en: 'Government budget and finances' },
  },
  {
    id: 'health',
    icon: LocalHospital,
    name: { sr: 'Здравство', en: 'Healthcare' },
    description: { sr: 'Здравствени подаци и статистика', en: 'Healthcare data and statistics' },
  },
  {
    id: 'education',
    icon: School,
    name: { sr: 'Образовање', en: 'Education' },
    description: { sr: 'Образовни систем и статистика', en: 'Education system and statistics' },
  },
  {
    id: 'environment',
    icon: Nature,
    name: { sr: 'Животна средина', en: 'Environment' },
    description: { sr: 'Квалитет ваздуха, воде, земљишта', en: 'Air, water, soil quality' },
  },
  {
    id: 'transport',
    icon: DirectionsBus,
    name: { sr: 'Саобраћај', en: 'Transport' },
    description: { sr: 'Јавни превоз и инфраструктура', en: 'Public transport and infrastructure' },
  },
  {
    id: 'economy',
    icon: Business,
    name: { sr: 'Економија', en: 'Economy' },
    description: { sr: 'Економски показатељи', en: 'Economic indicators' },
  },
  {
    id: 'safety',
    icon: Security,
    name: { sr: 'Безбедност', en: 'Safety' },
    description: { sr: 'Јавна безбедност и криминал', en: 'Public safety and crime' },
  },
  {
    id: 'weather',
    icon: WbSunny,
    name: { sr: 'Временска прогноза', en: 'Weather' },
    description: { sr: 'Метеоролошки подаци', en: 'Meteorological data' },
  },
  {
    id: 'demographics',
    icon: Groups,
    name: { sr: 'Демографија', en: 'Demographics' },
    description: { sr: 'Становништво и миграције', en: 'Population and migration' },
  },
  {
    id: 'legal',
    icon: Gavel,
    name: { sr: 'Правни систем', en: 'Legal System' },
    description: { sr: 'Закони и прописи', en: 'Laws and regulations' },
  },
  {
    id: 'geo',
    icon: Public,
    name: { sr: 'Географија', en: 'Geography' },
    description: { sr: 'Географски подаци', en: 'Geographic data' },
  },
];

export const CategorySelection: React.FC<CategorySelectionProps> = ({
  selected,
  onSelect,
  onNext,
  onBack,
  language,
}) => {
  const toggleCategory = (categoryId: string) => {
    if (selected.includes(categoryId)) {
      onSelect(selected.filter((id) => id !== categoryId));
    } else {
      onSelect([...selected, categoryId]);
    }
  };

  const selectAll = () => {
    onSelect(categories.map((c) => c.id));
  };

  const clearAll = () => {
    onSelect([]);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      {/* Header */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 1 }}>
        {language === 'sr' ? 'Одаберите категорије' : 'Select Categories'}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {language === 'sr'
          ? 'Изаберите категорије података који вас интересују'
          : 'Choose the data categories that interest you'}
      </Typography>

      {/* Selection Count and Actions */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Chip
          label={
            language === 'sr'
              ? `Одабрано: ${selected.length} од ${categories.length}`
              : `Selected: ${selected.length} of ${categories.length}`
          }
          color={selected.length > 0 ? 'primary' : 'default'}
        />
        <Button size="small" onClick={selectAll}>
          {language === 'sr' ? 'Одабери све' : 'Select All'}
        </Button>
        <Button size="small" onClick={clearAll}>
          {language === 'sr' ? 'Обриши све' : 'Clear All'}
        </Button>
      </Stack>

      {/* Category Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 2,
          mb: 4,
        }}
      >
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selected.includes(category.id);

          return (
            <Card
              key={category.id}
              elevation={isSelected ? 8 : 2}
              sx={{
                border: isSelected ? 2 : 0,
                borderColor: 'primary.main',
                position: 'relative',
              }}
            >
              <CardActionArea onClick={() => toggleCategory(category.id)}>
                <CardContent sx={{ p: 2, textAlign: 'center', minHeight: 140 }}>
                  {/* Selected Indicator */}
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

                  {/* Icon */}
                  <Icon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />

                  {/* Category Name */}
                  <Typography variant="h6" gutterBottom>
                    {category.name[language]}
                  </Typography>

                  {/* Description */}
                  <Typography variant="body2" color="text.secondary">
                    {category.description[language]}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
      </Box>

      {/* Validation Message */}
      {selected.length === 0 && (
        <Typography variant="body2" color="warning.main" sx={{ mb: 2, textAlign: 'center' }}>
          {language === 'sr'
            ? 'Молимо одаберите барем једну категорију'
            : 'Please select at least one category'}
        </Typography>
      )}

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
          disabled={selected.length === 0}
          sx={{ minWidth: 120 }}
        >
          {language === 'sr' ? 'Даље' : 'Next'}
        </Button>
      </Stack>
    </Box>
  );
};

/**
 * LanguageSelection - Step 2 of onboarding wizard
 *
 * Features:
 * - Select interface language (Serbian/English)
 * - Visual language cards
 * - Navigation controls
 */

import { ArrowBack, ArrowForward, CheckCircle } from '@mui/icons-material';
import {
  Box,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Button,
  Stack,
} from '@mui/material';
import React from 'react';

interface LanguageSelectionProps {
  selected: 'sr' | 'en';
  onSelect: (language: 'sr' | 'en') => void;
  onNext: () => void;
  onBack: () => void;
}

const languages = [
  {
    code: 'sr' as const,
    name: 'Српски',
    nativeName: 'Serbian',
    description: 'Користите српски језик за интерфејс',
    flag: '🇷🇸',
  },
  {
    code: 'en' as const,
    name: 'English',
    nativeName: 'Енглески',
    description: 'Use English for the interface',
    flag: '🇬🇧',
  },
];

export const LanguageSelection: React.FC<LanguageSelectionProps> = ({
  selected,
  onSelect,
  onNext,
  onBack,
}) => {
  return (
    <Box sx={{ maxWidth: 700, mx: 'auto' }}>
      {/* Header */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 1 }}>
        Изаберите језик / Choose Language
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Одаберите језик који ћете користити за интерфејс
        <br />
        Select the language you'll use for the interface
      </Typography>

      {/* Language Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 2,
          mb: 4,
        }}
      >
        {languages.map((lang) => (
          <Card
            key={lang.code}
            elevation={selected === lang.code ? 8 : 2}
            sx={{
              border: selected === lang.code ? 2 : 0,
              borderColor: 'primary.main',
              position: 'relative',
            }}
          >
            <CardActionArea onClick={() => onSelect(lang.code)}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                {/* Selected Indicator */}
                {selected === lang.code && (
                  <CheckCircle
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      color: 'primary.main',
                      fontSize: 32,
                    }}
                  />
                )}

                {/* Flag */}
                <Typography variant="h1" sx={{ fontSize: 64, mb: 2 }}>
                  {lang.flag}
                </Typography>

                {/* Language Name */}
                <Typography variant="h5" gutterBottom>
                  {lang.name}
                </Typography>

                {/* Native Name */}
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {lang.nativeName}
                </Typography>

                {/* Description */}
                <Typography variant="body2" sx={{ mt: 2 }}>
                  {lang.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      {/* Navigation Buttons */}
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button
          variant="outlined"
          onClick={onBack}
          startIcon={<ArrowBack />}
          sx={{ minWidth: 120 }}
        >
          Назад / Back
        </Button>

        <Button
          variant="contained"
          onClick={onNext}
          endIcon={<ArrowForward />}
          sx={{ minWidth: 120 }}
        >
          Даље / Next
        </Button>
      </Stack>

      {/* Helper Text */}
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3, textAlign: 'center' }}>
        Можете касније променити језик у подешавањима
        <br />
        You can change the language later in settings
      </Typography>
    </Box>
  );
};

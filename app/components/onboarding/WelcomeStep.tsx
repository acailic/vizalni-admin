/**
 * WelcomeStep - First step of onboarding wizard
 *
 * Features:
 * - Bilingual welcome message (Serbian/English)
 * - Overview of wizard capabilities
 * - Call to action to begin
 */

import { ArrowForward, Palette, DataObject, Cloud } from '@mui/icons-material';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import React from 'react';

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
      {/* Welcome Header */}
      <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 3 }}>
        Dobrodošli / Welcome
      </Typography>

      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        Kreiranje vizualizacija za otvorene podatke Srbije
        <br />
        Create visualizations for Serbian open data
      </Typography>

      {/* Feature Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 4 }}>
        <Card elevation={2}>
          <CardContent>
            <DataObject sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Podaci / Datasets
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pristup data.gov.rs podacima
              <br />
              Access to data.gov.rs
            </Typography>
          </CardContent>
        </Card>

        <Card elevation={2}>
          <CardContent>
            <Palette sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Tema / Theme
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Prilagodite izgled
              <br />
              Customize appearance
            </Typography>
          </CardContent>
        </Card>

        <Card elevation={2}>
          <CardContent>
            <Cloud sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Objavljivanje / Deploy
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lako objavljivanje
              <br />
              Easy deployment
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* What You'll Do */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Šta ćete uraditi / What You'll Do
      </Typography>

      <Box component="ol" sx={{ textAlign: 'left', maxWidth: 600, mx: 'auto', mb: 4 }}>
        <Typography component="li" sx={{ mb: 1 }}>
          Izaberite jezik / Choose language (Serbian/English)
        </Typography>
        <Typography component="li" sx={{ mb: 1 }}>
          Odaberite kategorije podataka / Select data categories
        </Typography>
        <Typography component="li" sx={{ mb: 1 }}>
          Pregledajte dostupne podatke / Browse available datasets
        </Typography>
        <Typography component="li" sx={{ mb: 1 }}>
          Prilagodite temu / Customize theme
        </Typography>
        <Typography component="li" sx={{ mb: 1 }}>
          Konfigurišite objavljivanje / Configure deployment
        </Typography>
      </Box>

      {/* CTA Button */}
      <Button
        variant="contained"
        size="large"
        onClick={onNext}
        endIcon={<ArrowForward />}
        sx={{ mt: 2, px: 4, py: 1.5 }}
      >
        Počnite / Get Started
      </Button>

      {/* Time Estimate */}
      <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
        Procenjeno vreme: ~5 minuta / Estimated time: ~5 minutes
      </Typography>
    </Box>
  );
};

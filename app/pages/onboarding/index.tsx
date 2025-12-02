/**
 * Onboarding Wizard - Main Entry Point
 *
 * 6-step wizard for new user onboarding:
 * 1. Welcome
 * 2. Language Selection
 * 3. Category Selection
 * 4. Dataset Browser
 * 5. Theme Customization
 * 6. Deployment Options
 */

import { Container, Box, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { CategorySelection } from '@/components/onboarding/CategorySelection';
import { DatasetBrowser } from '@/components/onboarding/DatasetBrowser';
import { DeploymentOptions } from '@/components/onboarding/DeploymentOptions';
import { LanguageSelection } from '@/components/onboarding/LanguageSelection';
import { StepperWizard } from '@/components/onboarding/StepperWizard';
import { ThemeCustomization } from '@/components/onboarding/ThemeCustomization';
import { WelcomeStep } from '@/components/onboarding/WelcomeStep';

export interface OnboardingData {
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
}

const STORAGE_KEY = 'vizualni-admin-onboarding';

export default function OnboardingWizard() {
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    language: 'sr',
    categories: [],
    datasets: {},
    theme: {
      mode: 'light',
    },
    deployment: {
      type: 'local',
    },
  });

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(parsed.data || data);
        setActiveStep(parsed.step || 0);
      } catch (e) {
        console.error('Failed to load onboarding progress:', e);
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ step: activeStep, data })
    );
  }, [activeStep, data]);

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const steps = [
    {
      label: { sr: 'Dobrodošli', en: 'Welcome' },
      component: <WelcomeStep onNext={handleNext} />,
    },
    {
      label: { sr: 'Jezik / Language', en: 'Language' },
      component: (
        <LanguageSelection
          selected={data.language}
          onSelect={(lang) => updateData({ language: lang })}
          onNext={handleNext}
          onBack={handleBack}
        />
      ),
    },
    {
      label: { sr: 'Kategorije', en: 'Categories' },
      component: (
        <CategorySelection
          selected={data.categories}
          onSelect={(cats) => updateData({ categories: cats })}
          onNext={handleNext}
          onBack={handleBack}
          language={data.language}
        />
      ),
    },
    {
      label: { sr: 'Podaci', en: 'Datasets' },
      component: (
        <DatasetBrowser
          categories={data.categories}
          selected={data.datasets}
          onSelect={(datasets) => updateData({ datasets })}
          onNext={handleNext}
          onBack={handleBack}
          language={data.language}
        />
      ),
    },
    {
      label: { sr: 'Tema', en: 'Theme' },
      component: (
        <ThemeCustomization
          theme={data.theme}
          onUpdate={(theme) => updateData({ theme })}
          onNext={handleNext}
          onBack={handleBack}
          language={data.language}
        />
      ),
    },
    {
      label: { sr: 'Objavljivanje', en: 'Deployment' },
      component: (
        <DeploymentOptions
          deployment={data.deployment}
          onUpdate={(deployment) => updateData({ deployment })}
          data={data}
          onBack={handleBack}
          language={data.language}
        />
      ),
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <StepperWizard
            steps={steps.map((s) => s.label[data.language])}
            activeStep={activeStep}
          />
          <Box sx={{ mt: 4 }}>{steps[activeStep].component}</Box>
        </Paper>
      </Box>
    </Container>
  );
}

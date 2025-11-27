/**
 * StepperWizard - Navigation component for onboarding wizard
 *
 * Features:
 * - Visual progress indicator
 * - Step labels
 * - Mobile responsive
 */

import { Stepper, Step, StepLabel, Box } from '@mui/material';
import React from 'react';

interface StepperWizardProps {
  steps: string[];
  activeStep: number;
}

export const StepperWizard: React.FC<StepperWizardProps> = ({
  steps,
  activeStep,
}) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

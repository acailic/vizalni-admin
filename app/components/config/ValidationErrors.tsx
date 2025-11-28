import { Alert, AlertTitle, List, ListItem, ListItemText } from '@mui/material';
import React from 'react';

import { ValidationIssue } from '@/lib/config/validator';

interface ValidationErrorsProps {
  errors: ValidationIssue[];
}

export const ValidationErrors: React.FC<ValidationErrorsProps> = ({ errors }) => {
  if (!errors.length) {
    return null;
  }

  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      <AlertTitle>Validation errors</AlertTitle>
      <List dense disablePadding>
        {errors.map((issue, idx) => (
          <ListItem key={`${issue.path}-${idx}`} disableGutters>
            <ListItemText primary={`${issue.path}: ${issue.message}`} />
          </ListItem>
        ))}
      </List>
    </Alert>
  );
};

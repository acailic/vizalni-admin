import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';


import { DataCubePublicationStatus } from '@/graphql/resolver-types';
import { theme } from '@/themes/theme';

import { DatasetResult, PartialSearchCube } from '../dataset-result';

// Mock makeStyles since it requires ThemeProvider in test context
vi.mock('@mui/styles', async () => {
  const actual = await vi.importActual('@mui/styles');
  return {
    ...actual,
    makeStyles: (styles: any) => () => {
      // Return a function that generates class names based on style keys
      const styleObj = typeof styles === 'function' ? styles(theme) : styles;
      const classes: Record<string, string> = {};
      Object.keys(styleObj).forEach(key => {
        classes[key] = `mock-${key}`;
      });
      return classes;
    },
  };
});

describe('DatasetResult XSS Prevention', () => {
  const mockDataCube: PartialSearchCube = {
    iri: 'test-iri',
    title: 'Test Dataset',
    description: 'Test Description',
    publicationStatus: DataCubePublicationStatus.Published,
  };

  const renderWithTheme = (ui: React.ReactElement) => {
    return render(
      <ThemeProvider theme={theme}>
        {ui}
      </ThemeProvider>
    );
  };

  it('should escape malicious HTML in highlightedTitle', () => {
    const maliciousTitle = '<script>alert("xss")</script>Test';

    renderWithTheme(
      <DatasetResult
        dataCube={mockDataCube}
        highlightedTitle={maliciousTitle}
      />
    );

    // Script tags should be escaped, not executed
    expect(screen.queryByText('alert("xss")')).not.toBeInTheDocument();
    expect(document.querySelector('script')).toBeNull();
  });

  it('should escape malicious HTML in highlightedDescription', () => {
    const maliciousDescription = '<img src=x onerror=alert("xss")>Test';

    renderWithTheme(
      <DatasetResult
        dataCube={mockDataCube}
        highlightedDescription={maliciousDescription}
      />
    );

    // Should not have img tag with onerror handler
    const img = document.querySelector('img[onerror]');
    expect(img).toBeNull();
  });

  it('should preserve safe HTML formatting tags', () => {
    const safeTitle = '<b>bold</b> and <em>italic</em>';

    renderWithTheme(
      <DatasetResult
        dataCube={mockDataCube}
        highlightedTitle={safeTitle}
      />
    );

    // Safe tags should be rendered
    const bold = document.querySelector('b');
    expect(bold).toBeInTheDocument();
    expect(bold?.textContent).toBe('bold');
  });
});

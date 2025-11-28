{
  "project": {
    "name": "My Custom Dashboard",
    "language": "sr",
    "theme": "custom"
  },
  "visualization": {
    "colorPalette": "custom",
    "customColors": [
      "#1f77b4",
      "#ff7f0e", 
      "#2ca02c",
      "#d62728",
      "#9467bd",
      "#8c564b"
    ]
  }
}
```

### Advanced Palette Configuration

For more control, you can define custom color mappings in your chart configurations:

```json
{
  "chartConfigs": [
    {
      "fields": {
        "color": {
          "type": "segment",
          "paletteId": "custom",
          "colorMapping": {
            "Category A": "#ff6b6b",
            "Category B": "#4ecdc4",
            "Category C": "#45b7d1"
          }
        }
      }
    }
  ]
}
```

## Typography Changes

### Font Family Customization

Override default fonts by adding custom CSS variables:

```css
:root {
  --font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;
}

[data-theme="custom"] {
  --font-family-heading: var(--font-family-sans);
  --font-family-body: var(--font-family-sans);
  --font-family-code: var(--font-family-mono);
}
```

### Font Size and Weight Adjustments

Customize typography scale through CSS custom properties:

```css
[data-theme="custom"] {
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}
```

## Logo Replacement

### Custom Logo Configuration

Replace the default logo by configuring the project settings and providing custom assets:

```json
{
  "project": {
    "name": "My Organization",
    "logo": {
      "src": "/custom-logo.png",
      "alt": "My Organization Logo",
      "width": 200,
      "height": 50
    }
  }
}
```

### Logo Styling

Add custom CSS for logo positioning and responsive behavior:

```css
.custom-logo {
  max-width: 200px;
  height: auto;
}

@media (max-width: 768px) {
  .custom-logo {
    max-width: 150px;
  }
}
```

## Layout Modifications

### Grid Layout Customization

Modify the dashboard layout through configuration:

```json
{
  "layout": {
    "type": "dashboard",
    "layout": "canvas",
    "layouts": {
      "lg": [
        {"i": "chart-1", "x": 0, "y": 0, "w": 6, "h": 4},
        {"i": "chart-2", "x": 6, "y": 0, "w": 6, "h": 4},
        {"i": "text-1", "x": 0, "y": 4, "w": 12, "h": 2}
      ]
    }
  }
}
```

### Custom CSS Layout Overrides

For advanced layout changes, override component styles:

```css
[data-theme="custom"] .dashboard-grid {
  gap: 2rem;
  padding: 1rem;
}

[data-theme="custom"] .chart-container {
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

[data-theme="custom"] .sidebar {
  width: 280px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## Before/After Screenshots

### Default Light Theme
![Default Light Theme](screenshots/default-light.png)

*Clean, minimal design with standard blue color palette*

### Custom Dark Theme  
![Custom Dark Theme](screenshots/custom-dark.png)

*Dark background with custom purple/blue gradient and adjusted typography*

### Fully Customized Theme
![Fully Customized Theme](screenshots/custom-full.png)

*Complete branding with custom logo, colors, fonts, and layout*

## Configuration Examples

### Complete Custom Theme Config

```json
{
  "project": {
    "name": "City of Belgrade Open Data",
    "language": "sr",
    "theme": "custom",
    "logo": {
      "src": "/belgrade-logo.png",
      "alt": "City of Belgrade",
      "width": 180,
      "height": 45
    }
  },
  "visualization": {
    "defaultChartType": "bar",
    "colorPalette": "belgrade",
    "customColors": [
      "#1e3a8a",  // Belgrade blue
      "#dc2626",  // Red accent
      "#16a34a",  // Green
      "#ca8a04",  // Yellow
      "#7c3aed",  // Purple
      "#0891b2"   // Cyan
    ]
  },
  "layout": {
    "type": "dashboard",
    "layout": "vertical",
    "blocks": [
      {
        "type": "text",
        "key": "header",
        "text": {
          "sr-Latn": "Dobrodošli u portal otvorenih podataka Grada Beograda",
          "sr-Cyrl": "Добродошли у портал отворених података Града Београда",
          "en": "Welcome to Belgrade Open Data Portal"
        }
      }
    ]
  }
}
```

### Custom CSS Variables

Create a `custom-theme.css` file and import it in your project:

```css
/* Belgrade City Theme */
:root {
  /* Color Palette */
  --color-primary: #1e3a8a;
  --color-secondary: #dc2626;
  --color-accent: #16a34a;
  --color-background: #ffffff;
  --color-surface: #f8fafc;
  --color-text: #1e293b;
  --color-text-secondary: #64748b;
  
  /* Typography */
  --font-family-heading: 'Montserrat', sans-serif;
  --font-family-body: 'Open Sans', sans-serif;
  --font-size-heading-1: 2.25rem;
  --font-size-heading-2: 1.875rem;
  --font-size-body: 1rem;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Border Radius */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

[data-theme="custom"] {
  /* Apply custom variables */
  background-color: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-family-body);
}

[data-theme="custom"] h1, 
[data-theme="custom"] h2 {
  font-family: var(--font-family-heading);
  color: var(--color-primary);
}

[data-theme="custom"] .btn-primary {
  background-color: var(--color-primary);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
}

[data-theme="custom"] .card {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
}
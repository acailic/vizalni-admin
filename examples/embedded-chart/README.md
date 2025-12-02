<!DOCTYPE html>
<html>
<head>
  <title>My Website with Embedded Chart</title>
</head>
<body>
  <h1>Serbian Population Statistics</h1>
  
  <iframe 
    src="https://your-vizualni-admin-site.com/embed/chart?config=population-2023"
    width="800" 
    height="600" 
    frameborder="0"
    allowfullscreen>
  </iframe>
  
  <p>Data source: Statistical Office of the Republic of Serbia</p>
</body>
</html>
```

#### Parameters

- `config`: Chart configuration ID or URL
- `theme`: Theme name (light/dark/custom)
- `lang`: Language code (sr/en)
- `readonly`: Disable user interactions (true/false)

### 2. JavaScript SDK

For more advanced embedding with JavaScript control, use the Vizualni Admin SDK.

#### Installation

Include the SDK script in your HTML:

```html
<script src="https://your-vizualni-admin-site.com/embed/sdk.js"></script>
```

#### Basic Usage

```html
<div id="chart-container"></div>

<script>
  // Initialize the embed
  const embed = VizualniAdmin.embed('#chart-container', {
    config: 'population-2023',
    theme: 'light',
    responsive: true
  });
  
  // Optional: Listen for events
  embed.on('ready', () => {
    console.log('Chart loaded successfully');
  });
  
  embed.on('error', (error) => {
    console.error('Chart loading failed:', error);
  });
</script>
```

#### Advanced Configuration

```javascript
const embed = VizualniAdmin.embed('#chart-container', {
  config: {
    type: 'bar',
    data: 'https://data.gov.rs/api/population',
    title: 'Population by Region',
    colors: ['#1f77b4', '#ff7f0e', '#2ca02c']
  },
  theme: {
    primary: '#007acc',
    background: '#ffffff'
  },
  interactions: {
    zoom: true,
    filter: true,
    export: false
  },
  responsive: {
    breakpoints: {
      mobile: 480,
      tablet: 768,
      desktop: 1024
    }
  }
});
```

## Responsive Sizing

### CSS-Based Responsive Design

```css
.chart-container {
  width: 100%;
  min-height: 400px;
  max-height: 800px;
}

@media (max-width: 768px) {
  .chart-container {
    min-height: 300px;
  }
}
```

### JavaScript Responsive Configuration

```javascript
const embed = VizualniAdmin.embed('#chart-container', {
  responsive: {
    aspectRatio: 16/9,
    minWidth: 320,
    maxWidth: 1200,
    breakpoints: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200
    }
  }
});
```

## Cross-Origin Considerations

### CORS Configuration

Ensure your Vizualni Admin server allows embedding from external domains:

```javascript
// Server-side CORS configuration (example for Express.js)
app.use('/embed', cors({
  origin: ['https://your-blog.com', 'https://another-site.com'],
  methods: ['GET', 'POST'],
  credentials: true
}));
```

### Security Headers

```http
Content-Security-Policy: frame-ancestors 'self' https://trusted-site.com;
X-Frame-Options: ALLOW-FROM https://trusted-site.com
```

### Handling CORS Errors

```javascript
const embed = VizualniAdmin.embed('#chart-container', {
  config: 'your-config',
  cors: {
    enabled: true,
    credentials: 'same-origin'
  }
}).catch(error => {
  if (error.name === 'CORS_ERROR') {
    // Handle CORS issues
    console.error('Embedding blocked by CORS policy');
  }
});
```

## Styling Options

### Theme Customization

```javascript
const embed = VizualniAdmin.embed('#chart-container', {
  theme: {
    name: 'custom',
    colors: {
      primary: '#007acc',
      secondary: '#6c757d',
      success: '#28a745',
      danger: '#dc3545',
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#212529'
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      fontSize: {
        small: '12px',
        medium: '14px',
        large: '16px'
      }
    },
    spacing: {
      small: '8px',
      medium: '16px',
      large: '24px'
    }
  }
});
```

### CSS Overrides

```html
<style>
  #chart-container .vizualni-chart {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  #chart-container .vizualni-legend {
    background: #f8f9fa;
    padding: 12px;
  }
</style>
```

## Advanced Features

### Event Handling

```javascript
const embed = VizualniAdmin.embed('#chart-container', config);

embed.on('data:load', (data) => {
  console.log('Data loaded:', data.length, 'records');
});

embed.on('chart:render', (chartType) => {
  console.log('Chart rendered:', chartType);
});

embed.on('user:interaction', (event) => {
  console.log('User interaction:', event.type, event.data);
});

embed.on('error', (error) => {
  console.error('Embed error:', error.message);
  // Show fallback content
  showFallbackChart();
});
```

### Dynamic Updates

```javascript
const embed = VizualniAdmin.embed('#chart-container', initialConfig);

// Update chart data
embed.updateData(newData);

// Change configuration
embed.updateConfig({
  title: 'Updated Title',
  colors: ['#ff0000', '#00ff00']
});

// Resize chart
embed.resize(800, 600);
```

### Export and Download

```javascript
const embed = VizualniAdmin.embed('#chart-container', config);

// Export as image
embed.exportImage('png').then(blob => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'chart.png';
  a.click();
});

// Export data
embed.exportData('csv').then(csv => {
  console.log('CSV data:', csv);
});
```

## Troubleshooting

### Common Issues

1. **Chart not loading**: Check network connectivity and CORS settings
2. **Styling not applied**: Ensure CSS loads after SDK initialization
3. **Responsive issues**: Verify container has proper CSS dimensions
4. **Cross-origin errors**: Configure server CORS policies correctly

### Debug Mode

Enable debug mode for development:

```javascript
const embed = VizualniAdmin.embed('#chart-container', {
  config: 'your-config',
  debug: true
});
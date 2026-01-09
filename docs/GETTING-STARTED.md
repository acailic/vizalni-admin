# Getting Started with Vizualni Admin

# Почетни кораци са Vizualni Admin

Welcome! This guide will help you get up and running with Vizualni Admin in
minutes.

---

## 🎯 What Can You Do With Vizualni Admin?

### For Non-Technical Users (No Code Required!)

- 📊 **Create Charts**: Turn data into beautiful visualizations
- 🇷🇸 **Use Serbian Data**: Access official data from data.gov.rs
- 📱 **Share Easily**: Embed charts in websites or export as images
- 🎨 **Customize**: Change colors, labels, and chart types

### For Developers

- 🔌 **Embed Charts**: Use React components in your projects
- 📦 **NPM Package**: Install as a dependency
- 🔧 **Customizable**: Full control over appearance and behavior
- 🌐 **API Access**: Connect to any data source

---

## 🎓 Interactive Learning

### Quick Start Demo (Recommended for Beginners)

Start with our
**[Interactive Getting Started Demo](https://acailic.github.io/vizualni-admin/demos/getting-started)** -
the fastest way to learn!

**What you'll experience:**

- ✅ **4 Chart Types**: Line, Bar, Column, and Pie charts
- ✅ **3 Sample Datasets**: Sales, Categories, and Trends data
- ✅ **Real-time Code Examples**: See the code for every chart you create
- ✅ **Interactive Controls**: Switch between chart types and datasets instantly
- ✅ **Multi-language Support**: Learn in Serbian or English

**Perfect for:**

- First-time users who want to see immediate results
- Developers exploring the library before installing
- Anyone who learns best by doing

---

## 🚀 Quick Start (3 Minutes)

### Option 1: Use the Live Demo (Fastest)

1. **Visit**:
   [https://acailic.github.io/vizualni-admin/](https://acailic.github.io/vizualni-admin/)
2. **Try the Interactive Quick Start**:
   [Getting Started Demo](https://acailic.github.io/vizualni-admin/demos/getting-started)
   - Experiment with different chart types
   - See real-time code examples
   - Learn with minimal sample data
3. **Explore Full Demos**:
   - [Economy Dashboard](https://acailic.github.io/vizualni-admin/demos/economy)
   - [Healthcare Crisis](https://acailic.github.io/vizualni-admin/demos/healthcare)
   - [Traffic Safety](https://acailic.github.io/vizualni-admin/demos/transport)
4. **Click** "Create Chart" or "Креирај графикон"
5. **Select** a dataset from the Serbian Open Data Portal
6. **Choose** a chart type (Line, Bar, Pie, etc.)
7. **Customize** colors and labels
8. **Save or Embed** your visualization

That's it! No installation needed.

### Option 2: Install on Your Computer

```bash
# Step 1: Clone the repository
git clone https://github.com/acailic/vizualni-admin.git
cd vizualni-admin

# Step 2: Install dependencies
yarn install

# Step 3: Start the application
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📚 Creating Your First Visualization

### Method 1: Using the Web Interface

1. **Navigate to Create Page**
   - Click "Create" in the top menu
   - Or go directly to
     [Create Chart](https://acailic.github.io/vizualni-admin/create)

2. **Choose Your Data**
   - **Option A**: Browse datasets from data.gov.rs
     - Click "Browse Serbian Data"
     - Filter by category (e.g., "Економија", "Здравство")
     - Select a dataset
   - **Option B**: Upload your own file
     - Click "Upload Data"
     - Supported formats: CSV, JSON, Excel

3. **Select Chart Type**
   - **Line Chart**: Best for trends over time
   - **Bar Chart**: Great for comparisons
   - **Pie Chart**: Shows proportions
   - **Map**: Geographic data visualization
   - **Table**: For detailed data view

4. **Customize Your Chart**
   - **Title**: Add a descriptive title
   - **Colors**: Choose from palettes or custom colors
   - **Labels**: Set axis labels and descriptions
   - **Filters**: Add date ranges or value filters

5. **Save and Share**
   - **Save**: Store in your gallery
   - **Export**: Download as PNG, SVG, or PDF
   - **Embed**: Get HTML code for your website

### Method 2: Using as React Component

```bash
# Install the package
npm install @acailic/vizualni-admin
```

```jsx
// In your React component
import { LineChart } from "@acailic/vizualni-admin";

function App() {
  const salesData = [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3000 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 4500 },
  ];

  return (
    <div>
      <h1>My Dashboard</h1>
      <LineChart
        data={salesData}
        xKey="month"
        yKey="sales"
        title="Monthly Sales"
        width={800}
        height={400}
      />
    </div>
  );
}
```

---

## 🇷🇸 Working with Serbian Data

### Finding Datasets

1. **Built-in Browser**
   - Go to [Browse Data](https://acailic.github.io/vizualni-admin/browse)
   - Use categories: Буџет, Здравство, Образовање, etc.
   - Search by keywords in Serbian or English

2. **Popular Datasets**
   - Буџет Републике Србије (Budget of Republic of Serbia)
   - Цене основних прехрамбених производа (Basic food prices)
   - Стопа незапослености (Unemployment rate)
   - Демографски подаци (Demographic data)

### Data Formats

Serbian datasets typically include:

- **Latinica**: Latin script (standard)
- **Ćirilica**: Cyrillic script (available for most data)
- **Date formats**: DD.MM.YYYY or ISO format
- **Numbers**: Use comma as decimal separator (e.g., 1.234,56)

---

## 🎨 Customization Guide

### Color Schemes

```jsx
// Serbian national colors
const serbianColors = ["#C6363C", "#0C4076", "#FFFFFF"];

// Professional palette
const professionalPalette = ["#0090ff", "#00d4ff", "#7c4dff"];

// Warm palette
const warmPalette = ["#ff6b6b", "#feca57", "#ff9ff3"];
```

### Language Support

```jsx
// Set language preference
<LineChart
  data={data}
  locale="sr-Latn" // Serbian Latin
  // or
  locale="sr-Cyrl" // Serbian Cyrillic
  // or
  locale="en" // English
/>
```

### Responsive Design

```jsx
// Make charts responsive
<LineChart
  data={data}
  width="100%" // Use percentage for responsive width
  height={400}
  maintainAspectRatio={true}
/>
```

---

## 📤 Exporting and Sharing

### Export Formats

| Format   | Best For                 | Features                             |
| -------- | ------------------------ | ------------------------------------ |
| **PNG**  | Presentations, documents | High quality, transparent background |
| **SVG**  | Web, scalable graphics   | Vector format, infinitely scalable   |
| **PDF**  | Reports, printing        | Multi-page, vector graphics          |
| **HTML** | Embedding in websites    | Interactive chart                    |

### Embedding in Websites

```html
<!-- Simple iframe embed -->
<iframe
  src="https://acailic.github.io/vizualni-admin/embed/your-chart-id"
  width="800"
  height="400"
  frameborder="0"
  scrolling="no"
>
</iframe>

<!-- Responsive embed -->
<div style="position: relative; padding-bottom: 50%;">
  <iframe
    src="https://acailic.github.io/vizualni-admin/embed/your-chart-id"
    style="position: absolute; width: 100%; height: 100%;"
    frameborder="0"
  >
  </iframe>
</div>
```

---

## 🔧 Advanced Features

### Real-time Data Updates

```jsx
import { useDataGovRs } from "@acailic/vizualni-admin";

function LiveChart() {
  const { data, loading, error } = useDataGovRs("budzet-srbije", {
    refreshInterval: 60000, // Update every minute
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return <BarChart data={data} xKey="godina" yKey="iznos" />;
}
```

### Custom Themes

```jsx
const darkTheme = {
  background: "#1a1a1a",
  grid: "#333",
  text: "#fff",
  colors: ["#0090ff", "#00d4ff", "#7c4dff"],
};

<LineChart data={data} theme={darkTheme} showGrid={true} showTooltip={true} />;
```

### Data Filtering

```jsx
<LineChart
  data={data}
  filters={{
    dateRange: ["2020-01-01", "2023-12-31"],
    categories: ["Здравство", "Образовање"],
    minValue: 1000,
  }}
/>
```

---

## 🛠️ Deployment Options

### GitHub Pages (Free)

1. **Fork the repository** on GitHub
2. **Enable GitHub Pages** in repository settings
3. **Push to main branch** - automatic deployment!

### Vercel (Free Tier)

```bash
# Deploy with one click
npm i -g vercel
vercel --prod
```

### Your Own Server

```bash
# Build static files
yarn build:static

# Upload the 'out' folder to your server
# Configure your web server to serve static files
```

---

## 💡 Pro Tips

### For Better Performance

- 📊 **Limit data points**: Show max 1000 points for line charts
- 🎨 **Use simpler animations**: Disable animations on mobile
- 📦 **Compress images**: Optimize before uploading

### For Better Design

- 🎨 **Stick to 3-5 colors**: Don't overwhelm viewers
- 📝 **Label everything**: Always include axis labels and titles
- 📱 **Test on mobile**: Ensure charts work on small screens

### For Serbian Data

- 🇷🇸 **Use consistent script**: Don't mix Latin and Cyrillic
- 📅 **Check date formats**: Serbian uses DD.MM.YYYY
- 💰 **Currency**: Use RSD for Serbian dinar

---

## 🆘 Common Issues

### "Chart is not showing"

- Check your data format
- Ensure all required props are provided
- Check browser console for errors

### "Data not loading from data.gov.rs"

- Check internet connection
- Verify dataset ID is correct
- Some datasets may be temporarily unavailable

### "Export not working"

- Clear browser cache
- Try a different browser
- Check if pop-ups are blocked

---

## 📚 Next Steps

### Learn More

- 📖 [Full Documentation](https://acailic.github.io/vizualni-admin/docs)
- 🎓 [Video Tutorials](https://www.youtube.com/playlist/...)
- 💡 [Examples Gallery](https://acailic.github.io/vizualni-admin/gallery)

### Get Help

- 🐛 [Report Issues](https://github.com/acailic/vizualni-admin/issues)
- 💬 [Discussions](https://github.com/acailic/vizualni-admin/discussions)
- 📧 [Email Support](mailto:support@vizualni-admin.rs)

### Contribute

- 🔧
  [Contributing Guide](https://github.com/acailic/vizualni-admin/blob/main/CONTRIBUTING.md)
- 🏆
  [Feature Requests](https://github.com/acailic/vizualni-admin/issues/new?template=feature_request.md)

---

## 🎉 You're Ready!

Congratulations! You now know how to:

- ✅ Create beautiful visualizations
- ✅ Use Serbian open data
- ✅ Customize and export charts
- ✅ Embed visualizations in websites

Start creating your first visualization now at
[https://acailic.github.io/vizualni-admin/](https://acailic.github.io/vizualni-admin/)

Happy visualizing! / Срећно визуализовање!

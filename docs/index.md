---
layout: home
hero:
  name: Vizualni Admin
  text: Serbian Open Data Visualization Tool
  tagline: Create beautiful, interactive visualizations from Serbian government data
  image:
    src: /hero-image.svg
    alt: Vizualni Admin Logo
  actions:
    - theme: brand
      text: Get Started
      link: /guide/quick-start
    - theme: alt
      text: View Demo
      link: https://acailic.github.io/vizualni-admin/
    - theme: alt
      text: GitHub
      link: https://github.com/acailic/vizualni-admin

features:
  - icon: 📊
    title: Rich Chart Library
    details: Support for line charts, bar charts, maps, scatter plots, and more with full customization options.
  - icon: 🇷🇸
    title: Serbian Data Integration
    details: Native integration with data.gov.rs API for seamless access to Serbian government datasets.
  - icon: 🌍
    title: Multilingual Support
    details: Full Serbian (Latin and Cyrillic) and English support with more languages coming soon.
  - icon: 📱
    title: Responsive Design
    details: Works perfectly on desktop, tablet, and mobile devices with touch-friendly interactions.
  - icon: ♿
    title: Accessibility First
    details: WCAG 2.1 compliant with screen reader support and keyboard navigation.
  - icon: 🔧
    title: Developer Friendly
    details: TypeScript-first with comprehensive APIs, easy embedding, and extensive customization.
  - icon: ⚡
    title: High Performance
    details: Built with Next.js, optimized for speed with server-side rendering and efficient data handling.
  - icon: 🎨
    title: Beautiful Theming
    details: Material-UI based with customizable themes to match your brand identity.

  footer: BSD-3-Clause License | Published with ❤️ by the Serbian open data community
---

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // Add any home page specific JavaScript here
})
</script>

<div class="grid-container">
  <div class="demo-section">
    <h2>See It In Action</h2>
    <p>Explore interactive examples showcasing Vizualni Admin's capabilities</p>
    <div class="demo-grid">
      <a href="/examples/serbian-demographics" class="demo-card">
        <h3>Population Dynamics</h3>
        <p>Interactive visualization of Serbian demographic data</p>
        <span class="demo-tag">Population Data</span>
      </a>
      <a href="/examples/economic-indicators" class="demo-card">
        <h3>Economic Indicators</h3>
        <p>Track key economic metrics from Serbian government data</p>
        <span class="demo-tag">Economics</span>
      </a>
      <a href="/examples/regional-mapping" class="demo-card">
        <h3>Regional Mapping</h3>
        <p>Geographic visualizations of Serbian regions and municipalities</p>
        <span class="demo-tag">Maps</span>
      </a>
    </div>
  </div>
</div>

<style scoped>
.grid-container {
  margin-top: 2rem;
}

.demo-section {
  text-align: center;
  padding: 3rem 0;
  border-top: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
  margin: 3rem 0;
}

.demo-section h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--vp-c-brand-1);
}

.demo-section p {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
}

.demo-card {
  display: block;
  padding: 1.5rem;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.demo-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand-1);
}

.demo-card h3 {
  margin: 0 0 0.5rem 0;
  color: var(--vp-c-brand-1);
  font-size: 1.25rem;
}

.demo-card p {
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.demo-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .demo-grid {
    grid-template-columns: 1fr;
  }

  .demo-section {
    padding: 2rem 0;
  }
}
</style>
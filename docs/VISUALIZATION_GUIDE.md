# Visualization Best Practices Guide

## Overview

This guide establishes best practices for creating effective data visualizations in the Visual Admin Serbia platform, based on research of leading open data platforms and data visualization principles.

## Design Principles

### 1. Clarity First
- **Purpose**: Every visualization must have a clear message
- **Audience**: Design for citizens, journalists, and researchers
- **Simplicity**: Remove chart junk and unnecessary decoration
- **Accessibility**: Ensure readability for all users

### 2. Data Integrity
- **Accuracy**: Never mislead or distort data
- **Context**: Provide necessary context (time periods, geographic scope)
- **Sourcing**: Always cite the data source (data.gov.rs)
- **Uncertainty**: Show confidence intervals when relevant

### 3. Serbian Context
- **Bilingual**: Support Cyrillic and Latin scripts
- **Local**: Use familiar geographic references
- **Cultural**: Respect cultural norms and expectations
- **Constitutional**: Default to Cyrillic script

## Chart Type Selection

### By Data Type

| Data Type | Primary Chart | Alternative | Use Case |
|-----------|--------------|-------------|----------|
| **Part-to-whole** | Pie/Donut | Treemap | Budget allocation |
| **Comparison** | Bar Chart | Grouped Bar | Compare categories |
| **Trend** | Line Chart | Area Chart | Time series |
| **Distribution** | Histogram | Box Plot | Data spread |
| **Correlation** | Scatter Plot | Bubble Chart | Relationship |
| **Geographic** | Choropleth | Bubble Map | Regional data |
| **Flow** | Sankey | Alluvial | Transfers |
| **Hierarchy** | Treemap | Sunburst | Nested categories |

### By Domain

#### Public Finance
- **Budget**: Treemap (hierarchical allocation)
- **Expenditure**: Line chart (temporal tracking)
- **Revenue**: Stacked bar (sources breakdown)

#### Health
- **Vaccination rates**: Choropleth map (regional coverage)
- **Hospital capacity**: Horizontal bar chart (comparison)
- **Disease spread**: Heatmap (temporal + geographic)

#### Education
- **School rankings**: Grouped bar chart (multiple metrics)
- **Enrollment trends**: Stacked area chart (over time)
- **School locations**: Point map with clustering

#### Transport
- **Traffic accidents**: Heatmap (hotspots)
- **Public transport**: Flow map (passenger movement)
- **Vehicle registrations**: Multi-line chart (categories over time)

#### Environment
- **Air quality**: Time series with threshold indicators
- **Water quality**: Choropleth map (regional status)
- **Waste composition**: Treemap (by type)

## Color Schemes

### Accessibility-First Colors

**Categorical (colorblind-safe, 8 colors):**
- Blue: `#1f77b4`
- Orange: `#ff7f0e`
- Green: `#2ca02c`
- Red: `#d62728`
- Purple: `#9467bd`
- Brown: `#8c564b`
- Pink: `#e377c2`
- Gray: `#7f7f7f`

**Sequential:**
- Blue scale: `#eff3ff` → `#08519c`
- Green scale: `#f7fcf5` → `#006d2c`

**Diverging:**
- Red-Blue: `#b2182b` → `#2166ac`

**Serbian Theme:**
- Primary (Red): `#C6363C`
- Secondary (Blue): `#0C4076`
- Accent (White): `#FFFFFF`
- Background: `#F5F5F5`

### Color Application Rules
1. **Consistency**: Same category = same color across charts
2. **Meaning**: Use intuitive colors (red=negative, green=positive)
3. **Contrast**: Ensure 4.5:1 contrast ratio for text
4. **Cultural**: Consider color associations in Serbian culture
5. **Printing**: Test in grayscale for print media

## Typography

### Font Hierarchy
- **Headings**: Roboto/Arial, 2rem, bold (700)
- **Chart Titles**: Roboto, 1.25rem, semi-bold (600)
- **Axis Labels**: 0.875rem, medium (500), dark gray
- **Data Labels**: 0.75rem, regular (400), black
- **Tooltips**: 0.875rem, white on dark background

### Serbian Language Considerations
- **Cyrillic Support**: Use fonts with good Cyrillic coverage (Roboto, Open Sans)
- **Diactrics**: Support Č, Ć, Š, Ž, Đ
- **Text Length**: Serbian text can be 15-20% longer than English
- **Script Consistency**: Maintain visual parity between Cyrillic and Latin

## Interactivity

### Essential Interactions
1. **Hover**: Show tooltips with detailed information
2. **Click**: Drill-down into data details
3. **Zoom**: For maps and dense time series
4. **Filter**: Allow users to subset data
5. **Download**: Export chart as PNG/SVG/PDF

### Tooltip Structure
- **Title**: Region/Category name
- **Value**: Formatted with locale (e.g., 1.234.567 РСД)
- **Period**: Date range
- **Source**: data.gov.rs attribution
- **Action**: "Click for details"

### Animation Guidelines
- **Duration**: 300-500ms for transitions
- **Easing**: ease-out for enter, ease-in for exit
- **Purpose**: Guide attention, not distract
- **Accessibility**: Respect `prefers-reduced-motion`

---

*Continue to Part 2 for Responsive Design and Accessibility*

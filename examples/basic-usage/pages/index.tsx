// pages/index.tsx
// This is a basic example demonstrating how to use Vizualni Admin for Serbian open data visualization.
// We'll set up internationalization with I18nProvider and create a simple bar chart using D3 with Serbian locale formatting.

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { I18nProvider, defaultLocale, getD3FormatLocale } from 'vizualni-admin';

// Sample data for a simple bar chart showing population by region
const sampleData = [
  { region: 'Beograd', population: 1680000 },
  { region: 'Novi Sad', population: 380000 },
  { region: 'Niš', population: 260000 },
  { region: 'Kragujevac', population: 180000 },
  { region: 'Subotica', population: 140000 },
];

export default function Home() {
  const chartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Get Serbian number formatting locale for proper display
    const formatLocale = getD3FormatLocale();
    const formatNumber = formatLocale.format(',.0f');

    // Clear any existing chart
    d3.select(chartRef.current).selectAll('*').remove();

    // Set up chart dimensions
    const margin = { top: 20, right: 30, bottom: 40, left: 90 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG container
    const svg = d3.select(chartRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Set up scales
    const x = d3.scaleLinear()
      .domain([0, d3.max(sampleData, d => d.population)!])
      .range([0, width]);

    const y = d3.scaleBand()
      .domain(sampleData.map(d => d.region))
      .range([0, height])
      .padding(0.1);

    // Add bars
    svg.selectAll('.bar')
      .data(sampleData)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('y', d => y(d.region)!)
      .attr('width', d => x(d.population))
      .attr('height', y.bandwidth())
      .attr('fill', 'steelblue');

    // Add x-axis with formatted numbers
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d => formatNumber(d as number)));

    // Add y-axis
    svg.append('g')
      .call(d3.axisLeft(y));

    // Add labels
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 5)
      .style('text-anchor', 'middle')
      .text('Population');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 15)
      .style('text-anchor', 'middle')
      .text('Region');
  }, []);

  return (
    // Wrap the entire app with I18nProvider to enable internationalization
    // This sets up the locale context for Serbian language support
    <I18nProvider locale={defaultLocale}>
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Vizualni Admin Basic Example</h1>
        <p>This example shows how to use Vizualni Admin for creating data visualizations with Serbian locale support.</p>
        
        {/* Container for the D3 chart */}
        <div>
          <h2>Population by Region (Sample Data)</h2>
          <svg ref={chartRef}></svg>
        </div>
        
        <p>The chart above uses Serbian number formatting (with commas as thousand separators) provided by Vizualni Admin's locale utilities.</p>
      </div>
    </I18nProvider>
  );
}
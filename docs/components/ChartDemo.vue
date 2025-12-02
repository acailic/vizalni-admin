<template>
  <div class="chart-demo">
    <div class="chart-container" :ref="containerRef" :style="{ height: height }">
      <!-- Chart will be rendered here -->
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="chart-loading">
      <div class="spinner"></div>
      <p>Loading chart data...</p>
    </div>

    <!-- Error state -->
    <div v-if="error" class="chart-error">
      <div class="error-icon">⚠️</div>
      <h4>Failed to load chart</h4>
      <p>{{ error }}</p>
      <button @click="retry" class="retry-button">Retry</button>
    </div>

    <!-- Chart controls -->
    <div v-if="showControls && chart" class="chart-controls">
      <button @click="exportChart('png')" class="control-button">
        📊 Export PNG
      </button>
      <button @click="exportChart('svg')" class="control-button">
        🖼️ Export SVG
      </button>
      <button @click="exportChart('pdf')" class="control-button">
        📄 Export PDF
      </button>
      <button @click="toggleFullscreen" class="control-button">
        🔳 Fullscreen
      </button>
      <button @click="copyCode" class="control-button">
        📋 Copy Code
      </button>
    </div>

    <!-- Source code modal -->
    <div v-if="showCode" class="code-modal" @click.self="showCode = false">
      <div class="code-content">
        <div class="code-header">
          <h3>Source Code</h3>
          <button @click="showCode = false" class="close-button">×</button>
        </div>
        <pre><code :class="codeLanguage">{{ codeSnippet }}</code></pre>
        <button @click="copyCode" class="copy-button">Copy to Clipboard</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { BarChart, LineChart, AreaChart, ScatterPlot, PieChart, ChoroplethMap } from '@acailic/vizualni-admin/charts'
import { createDataGovRsClient } from '@acailic/vizualni-admin'

interface Props {
  type: 'bar' | 'line' | 'area' | 'scatter' | 'pie' | 'map'
  data?: any[]
  config?: any
  height?: string
  showControls?: boolean
  autoLoad?: boolean
  dataSource?: string
  codeLanguage?: string
}

interface Emits {
  (e: 'ready', chart: any): void
  (e: 'error', error: string): void
  (e: 'dataLoaded', data: any[]): void
}

const props = withDefaults(defineProps<Props>(), {
  height: '400px',
  showControls: true,
  autoLoad: true,
  codeLanguage: 'typescript'
})

const emit = defineEmits<Emits>()

const containerRef = ref<HTMLDivElement>()
const chart = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const showCode = ref(false)
const isFullscreen = ref(false)

// Computed code snippet based on chart type and config
const codeSnippet = computed(() => {
  const baseCode = `import { ${props.type.charAt(0).toUpperCase() + props.type.slice(1)}Chart } from '@acailic/vizualni-admin/charts'

const chart = new ${props.type.charAt(0).toUpperCase() + props.type.slice(1)}Chart({
  data: ${props.data ? JSON.stringify(props.data.slice(0, 3), null, 2) + '...' : '// Load your data here'},
  ${Object.entries(props.config || {}).map(([key, value]) =>
    `${key}: ${JSON.stringify(value)}`
  ).join(',\n  ')}
})

chart.render('#chart-container')`

  return baseCode
})

// Load data from data.gov.rs if dataSource is provided
const loadData = async () => {
  if (!props.dataSource || props.data) return

  loading.value = true
  error.value = null

  try {
    const client = createDataGovRsClient()
    const response = await fetch(`/api/examples/${props.dataSource}`)
    const data = await response.json()

    emit('dataLoaded', data)

    if (!chart.value) {
      createChart(data)
    } else {
      chart.value.updateData(data)
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load data'
    emit('error', error.value)
  } finally {
    loading.value = false
  }
}

// Create chart instance
const createChart = (data?: any[]) => {
  if (!containerRef.value) return

  const chartData = data || props.data || []

  try {
    const chartConfig = {
      data: chartData,
      ...props.config,
      responsive: true,
      animations: true,
      interactive: true
    }

    switch (props.type) {
      case 'bar':
        chart.value = new BarChart(chartConfig)
        break
      case 'line':
        chart.value = new LineChart(chartConfig)
        break
      case 'area':
        chart.value = new AreaChart(chartConfig)
        break
      case 'scatter':
        chart.value = new ScatterPlot(chartConfig)
        break
      case 'pie':
        chart.value = new PieChart(chartConfig)
        break
      case 'map':
        chart.value = new ChoroplethMap(chartConfig)
        break
      default:
        throw new Error(`Unsupported chart type: ${props.type}`)
    }

    chart.value.render(containerRef.value)
    emit('ready', chart.value)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to create chart'
    emit('error', error.value)
  }
}

// Export chart
const exportChart = async (format: string) => {
  if (!chart.value) return

  try {
    const blob = await chart.value.export(format)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vizualni-admin-chart.${format}`
    a.click()
    URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Export failed:', err)
    alert('Export failed. Please try again.')
  }
}

// Toggle fullscreen
const toggleFullscreen = () => {
  if (!containerRef.value) return

  if (!isFullscreen.value) {
    containerRef.value.requestFullscreen?.()
    isFullscreen.value = true
  } else {
    document.exitFullscreen?.()
    isFullscreen.value = false
  }
}

// Copy code to clipboard
const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(codeSnippet.value)
    showNotification('Code copied to clipboard!')
  } catch (err) {
    console.error('Copy failed:', err)
    showNotification('Failed to copy code')
  }
}

// Show notification
const showNotification = (message: string) => {
  const notification = document.createElement('div')
  notification.className = 'notification'
  notification.textContent = message
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease'
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}

// Retry loading
const retry = () => {
  if (props.dataSource) {
    loadData()
  } else {
    createChart()
  }
}

// Lifecycle
onMounted(async () => {
  if (props.autoLoad) {
    if (props.dataSource && !props.data) {
      await loadData()
    } else {
      createChart()
    }
  }
})

onUnmounted(() => {
  if (chart.value) {
    chart.value.destroy?.()
  }
})

// Handle fullscreen changes
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>

<style scoped>
.chart-demo {
  position: relative;
  width: 100%;
}

.chart-container {
  width: 100%;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg);
}

.chart-loading,
.chart-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 300px;
  color: var(--vp-c-text-2);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--vp-c-border);
  border-top: 4px solid var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.chart-error h4 {
  margin: 0 0 0.5rem 0;
  color: var(--vp-c-brand-1);
}

.chart-error p {
  margin: 0 0 1rem 0;
  text-align: center;
  max-width: 300px;
}

.retry-button,
.copy-button {
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;
}

.retry-button:hover,
.copy-button:hover {
  background: var(--vp-c-brand-2);
}

.chart-controls {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.control-button {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-border);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.control-button:hover {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.code-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.code-content {
  background: var(--vp-c-bg);
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--vp-c-border);
}

.code-header h3 {
  margin: 0;
  color: var(--vp-c-text-1);
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--vp-c-text-2);
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.close-button:hover {
  background: var(--vp-c-bg-soft);
}

.code-content pre {
  flex: 1;
  overflow: auto;
  margin: 0;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  font-size: 0.875rem;
  line-height: 1.5;
}

.code-content code {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

.copy-button {
  margin: 1rem 1.5rem;
  align-self: flex-start;
}

/* Animations */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* Dark mode adjustments */
.dark .chart-container {
  border-color: var(--vp-c-border);
}

.dark .code-content {
  background: var(--vp-c-bg-alt);
}

/* Responsive design */
@media (max-width: 768px) {
  .chart-controls {
    justify-content: center;
  }

  .control-button {
    font-size: 0.75rem;
    padding: 0.4rem 0.8rem;
  }

  .code-modal {
    padding: 0.5rem;
  }

  .code-header {
    padding: 0.75rem 1rem;
  }

  .code-content pre {
    padding: 1rem;
    font-size: 0.75rem;
  }
}
</style>
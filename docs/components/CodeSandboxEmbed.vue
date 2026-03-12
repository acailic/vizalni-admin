<template>
  <div class="codesandbox-embed">
    <!-- CodeSandbox iframe -->
    <iframe
      v-if="sandboxId"
      :src="sandboxUrl"
      :style="iframeStyle"
      frameborder="0"
      allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
      sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
      :title="title"
      loading="lazy"
    ></iframe>

    <!-- Loading state -->
    <div v-if="loading" class="sandbox-loading">
      <div class="loader"></div>
      <p>Loading interactive example...</p>
    </div>

    <!-- Error state -->
    <div v-if="error" class="sandbox-error">
      <div class="error-icon">⚠️</div>
      <h4>Failed to load CodeSandbox</h4>
      <p>{{ error }}</p>
      <div class="error-actions">
        <a :href="externalUrl" target="_blank" rel="noopener noreferrer" class="external-link">
          Open in CodeSandbox ↗️
        </a>
        <button @click="retry" class="retry-button">Retry</button>
      </div>
    </div>

    <!-- Sandbox footer with controls -->
    <div v-if="showControls && sandboxId" class="sandbox-controls">
      <button @click="refreshSandbox" class="control-button" title="Refresh">
        🔄
      </button>
      <button @click="toggleFullscreen" class="control-button" title="Fullscreen">
        🔳
      </button>
      <a :href="externalUrl" target="_blank" rel="noopener noreferrer" class="control-button" title="Open in CodeSandbox">
        📦
      </a>
      <button @click="copyUrl" class="control-button" title="Copy URL">
        📋
      </button>
      <button @click="embedCode" class="control-button" title="Embed Code">
        📝
      </button>
    </div>

    <!-- Embed code modal -->
    <div v-if="showEmbedModal" class="embed-modal" @click.self="showEmbedModal = false">
      <div class="embed-content">
        <div class="embed-header">
          <h3>Embed This Example</h3>
          <button @click="showEmbedModal = false" class="close-button">×</button>
        </div>
        <p class="embed-description">
          Copy this HTML code to embed the interactive example in your website:
        </p>
        <div class="embed-code-block">
          <pre><code>{{ embedCode }}</code></pre>
          <button @click="copyEmbedCode" class="copy-embed-button">Copy</button>
        </div>
        <div class="embed-options">
          <label>
            <input v-model="embedOptions.width" type="text" placeholder="100%">
            Width
          </label>
          <label>
            <input v-model="embedOptions.height" type="text" placeholder="500px">
            Height
          </label>
          <label>
            <input v-model="embedOptions.theme" type="checkbox">
            Dark Theme
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

interface Props {
  sandboxId?: string
  title?: string
  height?: string
  width?: string
  view?: 'editor' | 'preview'
  theme?: 'light' | 'dark'
  showControls?: boolean
  autoLoad?: boolean
  customUrl?: string
  files?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Vizualni Admin Example',
  height: '500px',
  width: '100%',
  view: 'preview',
  theme: 'light',
  showControls: true,
  autoLoad: true
})

const loading = ref(false)
const error = ref<string | null>(null)
const isFullscreen = ref(false)
const showEmbedModal = ref(false)

// Embed options
const embedOptions = ref({
  width: '100%',
  height: '500px',
  theme: false
})

// Computed properties
const sandboxUrl = computed(() => {
  if (props.customUrl) return props.customUrl

  if (!props.sandboxId) return ''

  const baseUrl = 'https://codesandbox.io/embed'
  const params = new URLSearchParams({
    view: props.view,
    hidedevtools: '1',
    theme: props.theme,
    fontsize: '14',
    hidenavigation: '1',
    codemirror: '1',
    runonclick: '0'
  })

  return `${baseUrl}/${props.sandboxId}?${params.toString()}`
})

const externalUrl = computed(() => {
  return props.sandboxId
    ? `https://codesandbox.io/s/${props.sandboxId}`
    : props.customUrl || ''
})

const iframeStyle = computed(() => ({
  width: props.width,
  height: props.height,
  border: 0,
  borderRadius: '8px',
  overflow: 'hidden'
}))

const embedCode = computed(() => {
  const url = props.customUrl || sandboxUrl.value
  return `<iframe
  src="${url}"
  style="width: ${embedOptions.value.width}; height: ${embedOptions.value.height}; border: 0; border-radius: 8px; overflow: hidden;"
  title="${props.title}"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
  loading="lazy">
</iframe>`
})

// Methods
const refreshSandbox = () => {
  loading.value = true
  // Force iframe reload
  const iframe = document.querySelector('.codesandbox-embed iframe') as HTMLIFrameElement
  if (iframe) {
    const currentSrc = iframe.src
    iframe.src = ''
    setTimeout(() => {
      iframe.src = currentSrc
      loading.value = false
    }, 100)
  }
}

const toggleFullscreen = () => {
  const container = document.querySelector('.codesandbox-embed') as HTMLElement
  if (!container) return

  if (!isFullscreen.value) {
    container.requestFullscreen?.()
    isFullscreen.value = true
  } else {
    document.exitFullscreen?.()
    isFullscreen.value = false
  }
}

const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(externalUrl.value)
    showNotification('CodeSandbox URL copied to clipboard!')
  } catch (err) {
    console.error('Copy failed:', err)
    showNotification('Failed to copy URL')
  }
}

const embedCode = () => {
  showEmbedModal.value = true
}

const copyEmbedCode = async () => {
  try {
    await navigator.clipboard.writeText(embedCode.value)
    showNotification('Embed code copied to clipboard!')
    showEmbedModal.value = false
  } catch (err) {
    console.error('Copy failed:', err)
    showNotification('Failed to copy embed code')
  }
}

const retry = () => {
  error.value = null
  loading.value = true

  // Reload the iframe
  refreshSandbox()
}

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
    max-width: 300px;
    text-align: center;
  `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease'
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}

const loadSandbox = async () => {
  if (!props.autoLoad || !props.sandboxId) return

  loading.value = true
  error.value = null

  try {
    // Validate sandbox ID
    if (props.sandboxId) {
      // Preload the sandbox
      const img = new Image()
      img.src = `https://codesandbox.io/api/v1/sandboxes/${props.sandboxId}/screenshot.png`

      img.onload = () => {
        loading.value = false
      }

      img.onerror = () => {
        loading.value = false
      }
    }
  } catch (err) {
    error.value = 'Failed to load CodeSandbox example'
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadSandbox()
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

// Watch for prop changes
watch(() => props.sandboxId, () => {
  loadSandbox()
})
</script>

<style scoped>
.codesandbox-embed {
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.sandbox-loading,
.sandbox-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 500px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}

.loader {
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

.sandbox-error h4 {
  margin: 0 0 0.5rem 0;
  color: var(--vp-c-brand-1);
}

.sandbox-error p {
  margin: 0 0 1rem 0;
  text-align: center;
  max-width: 300px;
}

.error-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.external-link {
  background: var(--vp-c-brand-1);
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;
}

.external-link:hover {
  background: var(--vp-c-brand-2);
}

.retry-button {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-border);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.retry-button:hover {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.sandbox-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 0.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.dark .sandbox-controls {
  background: rgba(0, 0, 0, 0.8);
}

.control-button {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-border);
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-button:hover {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.control-button[title]:hover::after {
  content: attr(title);
  position: absolute;
  bottom: -2rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--vp-c-text-1);
  color: var(--vp-c-bg);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  z-index: 10;
}

/* Embed modal */
.embed-modal {
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

.embed-content {
  background: var(--vp-c-bg);
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.embed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--vp-c-border);
}

.embed-header h3 {
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

.embed-description {
  padding: 1rem 1.5rem 0;
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.embed-code-block {
  position: relative;
  margin: 1rem 1.5rem;
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.embed-code-block pre {
  margin: 0;
  padding: 1rem;
  font-size: 0.8rem;
  line-height: 1.4;
  overflow-x: auto;
  background: transparent;
}

.embed-code-block code {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

.copy-embed-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  transition: background-color 0.2s ease;
}

.copy-embed-button:hover {
  background: var(--vp-c-brand-2);
}

.embed-options {
  display: flex;
  gap: 1rem;
  padding: 0 1.5rem 1rem;
  flex-wrap: wrap;
}

.embed-options label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-1);
}

.embed-options input[type="text"] {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  width: 80px;
  font-size: 0.8rem;
}

.embed-options input[type="checkbox"] {
  width: auto;
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

/* Responsive design */
@media (max-width: 768px) {
  .sandbox-controls {
    top: 0.5rem;
    right: 0.5rem;
    gap: 0.25rem;
    padding: 0.25rem;
  }

  .control-button {
    width: 2rem;
    height: 2rem;
    font-size: 0.875rem;
  }

  .embed-modal {
    padding: 0.5rem;
  }

  .embed-header {
    padding: 0.75rem 1rem;
  }

  .embed-description {
    padding: 1rem;
    font-size: 0.85rem;
  }

  .embed-code-block {
    margin: 1rem;
  }

  .embed-code-block pre {
    padding: 0.75rem;
    font-size: 0.75rem;
  }

  .embed-options {
    padding: 0 1rem 1rem;
    flex-direction: column;
    gap: 0.75rem;
  }

  .error-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
/**
 * Vizualni Admin Srbije - Embed Helper Script
 *
 * This script automatically resizes embed iframes to fit their content.
 * Include it on any page that hosts embed iframes.
 *
 * Usage:
 *   1. Include the embed code with data-viz-admin-embed attribute
 *   2. Add this script: <script src="/embed.js" defer></script>
 *
 * The script will automatically find all iframes with data-viz-admin-embed
 * and resize them based on postMessage from the iframe.
 */
;(function () {
  'use strict'

  var RESIZE_MESSAGE_TYPE = 'viz-admin-resize'
  var IFRAME_SELECTOR = 'iframe[data-viz-admin-embed]'
  var MIN_HEIGHT = 200
  var MAX_HEIGHT = 2000

  // Store references to managed iframes
  var managedIframes = new Map()

  /**
   * Handle resize messages from embed iframes
   */
  function handleMessage(event) {
    // Validate message structure
    if (!event.data || typeof event.data !== 'object') {
      return
    }

    if (event.data.type !== RESIZE_MESSAGE_TYPE) {
      return
    }

    var height = event.data.height
    if (typeof height !== 'number' || !isFinite(height)) {
      return
    }

    // Find the iframe that sent this message
    var iframes = document.querySelectorAll(IFRAME_SELECTOR)
    for (var i = 0; i < iframes.length; i++) {
      var iframe = iframes[i]
      if (iframe.contentWindow === event.source) {
        resizeIframe(iframe, height)
        return
      }
    }
  }

  /**
   * Resize an iframe to the specified height
   */
  function resizeIframe(iframe, height) {
    // Clamp height to reasonable bounds
    var clampedHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, height))

    // Apply the height
    iframe.style.height = clampedHeight + 'px'
    iframe.style.minHeight = clampedHeight + 'px'

    // Mark as managed
    if (!managedIframes.has(iframe)) {
      managedIframes.set(iframe, true)
    }
  }

  /**
   * Find and set up all embed iframes
   */
  function setupIframes() {
    var iframes = document.querySelectorAll(IFRAME_SELECTOR)
    for (var i = 0; i < iframes.length; i++) {
      var iframe = iframes[i]
      if (!managedIframes.has(iframe)) {
        // Set initial styling
        iframe.style.transition = 'height 0.2s ease-out'
        iframe.style.overflow = 'hidden'
      }
    }
  }

  /**
   * Clean up event listeners
   */
  function cleanup() {
    window.removeEventListener('message', handleMessage)
  }

  // Set up message listener
  window.addEventListener('message', handleMessage)

  // Set up iframe discovery
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupIframes)
  } else {
    setupIframes()
  }

  // Also check periodically for new iframes (for SPAs)
  setInterval(setupIframes, 1000)

  // Clean up on page unload
  window.addEventListener('beforeunload', cleanup)

  // Expose cleanup method
  window.VizAdminEmbed = {
    cleanup: cleanup,
    refresh: setupIframes,
  }
})()

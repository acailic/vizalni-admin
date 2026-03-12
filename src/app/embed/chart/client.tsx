'use client'

import { useEffect } from 'react'

const RESIZE_MESSAGE_TYPE = 'viz-admin-resize'
const RESIZE_DEBOUNCE_MS = 100

/**
 * Client component that handles auto-resize via postMessage
 */
export default function EmbedClientScript() {
  useEffect(() => {
    // Only run if we're in an iframe
    if (window.parent === window) {
      return
    }

    let resizeTimeout: NodeJS.Timeout | null = null
    let lastHeight = 0

    const sendHeight = () => {
      const height = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight
      )

      // Only send if height changed
      if (height !== lastHeight) {
        lastHeight = height
        window.parent.postMessage(
          {
            type: RESIZE_MESSAGE_TYPE,
            height,
          },
          '*' // In production, consider restricting to specific origins
        )
      }
    }

    // Send initial height
    sendHeight()

    // Set up ResizeObserver for dynamic content changes
    const resizeObserver = new ResizeObserver(() => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout)
      }
      resizeTimeout = setTimeout(sendHeight, RESIZE_DEBOUNCE_MS)
    })

    // Observe the body and main content
    resizeObserver.observe(document.body)
    resizeObserver.observe(document.documentElement)

    // Also observe mutations for dynamic content
    const mutationObserver = new MutationObserver(() => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout)
      }
      resizeTimeout = setTimeout(sendHeight, RESIZE_DEBOUNCE_MS)
    })

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })

    // Cleanup
    return () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout)
      }
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [])

  return null
}

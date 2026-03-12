'use client'

import { useState, useCallback, useEffect } from 'react'

import * as Dialog from '@radix-ui/react-dialog'
import { Share2, Copy, Check, X, Link as LinkIcon, Mail } from 'lucide-react'

import { createShareableUrl, estimateUrlLength, isStateWithinUrlLimit, type UrlState } from '@/lib/url'

export interface ShareDialogProps {
  /** Chart state to encode in URL */
  state: UrlState
  /** Custom trigger button */
  trigger?: React.ReactNode
  /** Labels for i18n */
  labels?: {
    share?: string
    shareChart?: string
    copyLink?: string
    linkCopied?: string
    copy?: string
    close?: string
    shareViaEmail?: string
    shareLink?: string
    urlTooLong?: string
    characters?: string
  }
  /** Base URL for shareable link */
  baseUrl?: string
  /** Callback when URL is copied */
  onCopy?: (url: string) => void
  /** Callback when dialog opens/closes */
  onOpenChange?: (open: boolean) => void
}

const defaultLabels = {
  share: 'Share',
  shareChart: 'Share Chart',
  copyLink: 'Copy Link',
  linkCopied: 'Link Copied!',
  copy: 'Copy',
  close: 'Close',
  shareViaEmail: 'Share via Email',
  shareLink: 'Share this link',
  urlTooLong: 'Warning: URL may be too long for some browsers',
  characters: 'characters',
}

export function ShareDialog({
  state,
  trigger,
  labels = {},
  baseUrl,
  onCopy,
  onOpenChange,
}: ShareDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const mergedLabels = { ...defaultLabels, ...labels }

  // Generate shareable URL
  const shareableUrl = createShareableUrl(state, baseUrl)
  const urlLength = estimateUrlLength(state)
  const isWithinLimit = isStateWithinUrlLimit(state)

  // Reset copied state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setCopied(false)
    }
  }, [isOpen])

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open)
    onOpenChange?.(open)
  }, [onOpenChange])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl)
      setCopied(true)
      onCopy?.(shareableUrl)
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }, [shareableUrl, onCopy])

  const handleEmailShare = useCallback(() => {
    const subject = encodeURIComponent(state.config.title)
    const body = encodeURIComponent(
      `Check out this chart: ${state.config.title}\n\n${shareableUrl}`
    )
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank')
  }, [state.config.title, shareableUrl])

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        {trigger || (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Share2 className="h-4 w-4" />
            {mergedLabels.share}
          </button>
        )}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <Dialog.Title className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Share2 className="h-5 w-5 text-blue-600" />
            {mergedLabels.shareChart}
          </Dialog.Title>

          <Dialog.Description className="mt-2 text-sm text-slate-600">
            {mergedLabels.shareLink}
          </Dialog.Description>

          <Dialog.Close asChild>
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={mergedLabels.close}
            >
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>

          <div className="mt-6 space-y-4">
            {/* URL display and copy button */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    readOnly
                    value={shareableUrl}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={(e) => e.currentTarget.select()}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    copied
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      {mergedLabels.linkCopied}
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      {mergedLabels.copy}
                    </>
                  )}
                </button>
              </div>

              {/* URL length warning */}
              {!isWithinLimit && (
                <p className="flex items-center gap-1 text-xs text-amber-600">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
                  {mergedLabels.urlTooLong} ({urlLength} {mergedLabels.characters})
                </p>
              )}
            </div>

            {/* Share via email */}
            <button
              type="button"
              onClick={handleEmailShare}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Mail className="h-4 w-4" />
              {mergedLabels.shareViaEmail}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

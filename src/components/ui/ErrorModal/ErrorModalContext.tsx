'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Collapsible from '@radix-ui/react-collapsible'
import { AlertTriangle, X, ChevronDown, ChevronUp } from 'lucide-react'

export interface ErrorModalState {
  open: boolean
  message: string
  details?: string
  onRetry?: () => void
}

interface ErrorModalContextValue {
  showError: (message: string, details?: string, onRetry?: () => void) => void
  dismissError: () => void
}

const ErrorModalContext = createContext<ErrorModalContextValue | null>(null)

const defaultLabels = {
  title: 'Error',
  tryAgain: 'Try Again',
  dismiss: 'Dismiss',
  showDetails: 'Show technical details',
  hideDetails: 'Hide details',
}

export function ErrorModalProvider({
  children,
  labels = defaultLabels,
}: {
  children: ReactNode
  labels?: typeof defaultLabels
}) {
  const [state, setState] = useState<ErrorModalState>({
    open: false,
    message: '',
  })
  const [detailsOpen, setDetailsOpen] = useState(false)

  const showError = useCallback(
    (message: string, details?: string, onRetry?: () => void) => {
      setState({ open: true, message, details, onRetry })
      setDetailsOpen(false)
    },
    []
  )

  const dismissError = useCallback(() => {
    setState(prev => ({ ...prev, open: false }))
  }, [])

  const handleRetry = useCallback(() => {
    const retry = state.onRetry
    dismissError()
    retry?.()
  }, [state.onRetry, dismissError])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        dismissError()
      }
    },
    [dismissError]
  )

  return (
    <ErrorModalContext.Provider value={{ showError, dismissError }}>
      {children}
      <Dialog.Root open={state.open} onOpenChange={handleOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 rounded-full bg-red-100 p-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  {labels.title}
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-sm text-gray-600">
                  {state.message}
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  aria-label={labels.dismiss}
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            {state.details && (
              <Collapsible.Root open={detailsOpen} onOpenChange={setDetailsOpen} className="mt-4">
                <Collapsible.Trigger asChild>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    {detailsOpen ? labels.hideDetails : labels.showDetails}
                    {detailsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </Collapsible.Trigger>
                <Collapsible.Content className="mt-2 rounded-lg bg-gray-50 p-3">
                  <pre className="overflow-x-auto text-xs text-gray-500">{state.details}</pre>
                </Collapsible.Content>
              </Collapsible.Root>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {labels.dismiss}
                </button>
              </Dialog.Close>
              {state.onRetry && (
                <button
                  type="button"
                  onClick={handleRetry}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  {labels.tryAgain}
                </button>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </ErrorModalContext.Provider>
  )
}

export function useErrorModal(): ErrorModalContextValue {
  const context = useContext(ErrorModalContext)
  if (!context) {
    throw new Error('useErrorModal must be used within an ErrorModalProvider')
  }
  return context
}

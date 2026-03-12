'use client'

import { memo, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import type { Annotation } from '@/types/annotation'

interface AnnotationEditorProps {
  annotations: Annotation[]
  onChange: (annotations: Annotation[]) => void
  locale: 'sr-Cyrl' | 'sr-Latn' | 'en'
  labels?: {
    addAnnotation?: string
    title?: string
    description?: string
    target?: string
    color?: string
    style?: string
    filled?: string
    outline?: string
    defaultOpen?: string
    delete?: string
    edit?: string
    done?: string
  }
}

function AnnotationEditorComponent({ annotations, onChange, locale, labels }: AnnotationEditorProps) {
  const l = {
    addAnnotation: 'Add annotation',
    title: 'Title',
    description: 'Description',
    target: 'Target data point',
    color: 'Color',
    style: 'Style',
    filled: 'Filled',
    outline: 'Outline',
    defaultOpen: 'Open by default',
    delete: 'Delete',
    edit: 'Edit',
    done: 'Done',
    ...labels,
  }

  const [editingKey, setEditingKey] = useState<string | null>(null)

  const addAnnotation = () => {
    const newAnnotation: Annotation = {
      key: `annotation-${Date.now()}`,
      title: { en: '', 'sr-Cyrl': '', 'sr-Latn': '' },
      description: { en: '', 'sr-Cyrl': '', 'sr-Latn': '' },
      targets: [],
      style: 'filled',
      defaultOpen: false,
    }
    onChange([...annotations, newAnnotation])
    setEditingKey(newAnnotation.key)
  }

  const updateAnnotation = (key: string, updates: Partial<Annotation>) => {
    onChange(annotations.map(a => a.key === key ? { ...a, ...updates } : a))
  }

  const deleteAnnotation = (key: string) => {
    onChange(annotations.filter(a => a.key !== key))
    if (editingKey === key) {
      setEditingKey(null)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">
          Annotations ({annotations.length})
        </span>
        <button
          type="button"
          onClick={addAnnotation}
          className="text-sm text-gov-primary hover:underline"
        >
          + {l.addAnnotation}
        </button>
      </div>

      {annotations.map(annotation => (
        <div
          key={annotation.key}
          className={cn(
            'rounded-lg border p-3',
            editingKey === annotation.key ? 'border-gov-primary bg-gov-primary/5' : 'border-slate-200'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {annotation.title[locale] || annotation.title.en || 'Untitled'}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditingKey(editingKey === annotation.key ? null : annotation.key)}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                {editingKey === annotation.key ? l.done : l.edit}
              </button>
              <button
                type="button"
                onClick={() => deleteAnnotation(annotation.key)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                {l.delete}
              </button>
            </div>
          </div>

          {editingKey === annotation.key && (
            <div className="mt-3 space-y-2">
              {/* Title input */}
              <input
                type="text"
                placeholder={l.title}
                value={annotation.title[locale] || ''}
                onChange={(e) => {
                  const updated = { ...annotation.title, [locale]: e.target.value }
                  updateAnnotation(annotation.key, { title: updated })
                }}
                className="w-full rounded border border-slate-200 px-2 py-1 text-sm"
              />
              {/* Description input */}
              <textarea
                placeholder={l.description}
                value={annotation.description?.[locale] || ''}
                onChange={(e) => {
                  const updated = { ...annotation.description, [locale]: e.target.value }
                  updateAnnotation(annotation.key, { description: updated })
                }}
                className="w-full rounded border border-slate-200 px-2 py-1 text-sm"
                rows={2}
              />
              {/* Color input */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-500">{l.color}:</label>
                <input
                  type="color"
                  value={annotation.color || '#c0504d'}
                  onChange={(e) => updateAnnotation(annotation.key, { color: e.target.value })}
                  className="h-6 w-8 cursor-pointer rounded border border-slate-200"
                />
              </div>
              {/* Style toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{l.style}:</span>
                <button
                  type="button"
                  onClick={() => updateAnnotation(annotation.key, { style: 'filled' })}
                  className={cn(
                    'rounded px-2 py-1 text-xs',
                    annotation.style === 'filled' ? 'bg-gov-primary text-white' : 'bg-slate-100'
                  )}
                >
                  {l.filled}
                </button>
                <button
                  type="button"
                  onClick={() => updateAnnotation(annotation.key, { style: 'outline' })}
                  className={cn(
                    'rounded px-2 py-1 text-xs',
                    annotation.style === 'outline' ? 'bg-gov-primary text-white' : 'bg-slate-100'
                  )}
                >
                  {l.outline}
                </button>
              </div>
              {/* Default open toggle */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={annotation.defaultOpen}
                  onChange={(e) => updateAnnotation(annotation.key, { defaultOpen: e.target.checked })}
                  className="rounded border-slate-300"
                />
                <span className="text-xs text-slate-600">{l.defaultOpen}</span>
              </label>
            </div>
          )}
        </div>
      ))}

      {annotations.length === 0 && (
        <p className="text-center text-sm text-slate-500 py-4">
          No annotations yet. Click &quot;+ {l.addAnnotation}&quot; to add one.
        </p>
      )}
    </div>
  )
}

export const AnnotationEditor = memo(AnnotationEditorComponent)

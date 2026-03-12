/**
 * Hierarchical Filter Component
 *
 * A tree-based filter component for hierarchical data like
 * Serbian administrative geography. Supports multi-select,
 * expand/collapse, and search functionality.
 */

'use client'

import { memo, useState, useCallback, useMemo } from 'react'
import { ChevronDown, ChevronRight, Check, Minus, Search } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { GeographyNode } from '@/lib/data/serbian-geography'
import { getAllDescendantIds } from '@/lib/data/serbian-geography'

interface HierarchicalFilterProps {
  data: GeographyNode
  selectedIds: Set<string>
  onSelectionChange: (selectedIds: Set<string>) => void
  searchable?: boolean
  searchPlaceholder?: string
  className?: string
}

type SelectionState = 'all' | 'some' | 'none'

function getSelectionState(
  node: GeographyNode,
  selectedIds: Set<string>
): SelectionState {
  if (selectedIds.has(node.id)) {
    if (!node.children) return 'all'
    const allDescendants = getAllDescendantIds(node)
    const allSelected = allDescendants.every((id) => selectedIds.has(id))
    return allSelected ? 'all' : 'some'
  }

  if (!node.children) return 'none'

  const descendantIds = getAllDescendantIds(node)
  const selectedCount = descendantIds.filter((id) => selectedIds.has(id)).length

  if (selectedCount === 0) return 'none'
  if (selectedCount === descendantIds.length) return 'all'
  return 'some'
}

function nodeOrDescendantMatches(node: GeographyNode, query: string): boolean {
  if (node.label.toLowerCase().includes(query.toLowerCase())) return true
  return node.children?.some((child) => nodeOrDescendantMatches(child, query)) ?? false
}

interface TreeNodeProps {
  node: GeographyNode
  selectedIds: Set<string>
  expandedIds: Set<string>
  searchQuery: string
  depth: number
  onToggleExpand: (id: string) => void
  onToggleSelect: (node: GeographyNode, isFullySelected: boolean) => void
}

function TreeNode({
  node,
  selectedIds,
  expandedIds,
  searchQuery,
  depth,
  onToggleExpand,
  onToggleSelect,
}: TreeNodeProps) {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = expandedIds.has(node.id)
  const selectionState = getSelectionState(node, selectedIds)

  const matchesSearch = searchQuery === '' || nodeOrDescendantMatches(node, searchQuery)
  if (!matchesSearch) return null

  return (
    <div style={{ marginLeft: depth * 16 }}>
      <div className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-slate-100 cursor-pointer group">
        {/* Expand/collapse */}
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggleExpand(node.id)
            }}
            className="p-0.5 rounded hover:bg-slate-200"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-500" />
            )}
          </button>
        ) : (
          <div className="w-5" />
        )}

        {/* Checkbox */}
        <button
          type="button"
          onClick={() => onToggleSelect(node, selectionState === 'all')}
          className={cn(
            'w-5 h-5 rounded border flex items-center justify-center transition-colors',
            selectionState === 'all'
              ? 'bg-gov-primary border-gov-primary text-white'
              : selectionState === 'some'
                ? 'bg-gov-primary/20 border-gov-primary'
                : 'border-slate-300 group-hover:border-gov-primary'
          )}
        >
          {selectionState === 'all' && <Check className="w-3 h-3" />}
          {selectionState === 'some' && <Minus className="w-3 h-3 text-gov-primary" />}
        </button>

        {/* Label */}
        <span className="text-sm text-slate-700 flex-1">{node.label}</span>

        {/* Children count */}
        {hasChildren && (
          <span className="text-xs text-slate-400">({node.children!.length})</span>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              selectedIds={selectedIds}
              expandedIds={expandedIds}
              searchQuery={searchQuery}
              depth={depth + 1}
              onToggleExpand={onToggleExpand}
              onToggleSelect={onToggleSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function HierarchicalFilterComponent({
  data,
  selectedIds,
  onSelectionChange,
  searchable = true,
  searchPlaceholder = 'Search...',
  className,
}: HierarchicalFilterProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const handleToggleSelect = useCallback(
    (node: GeographyNode, isFullySelected: boolean) => {
      const descendantIds = getAllDescendantIds(node)
      const next = new Set(selectedIds)

      if (isFullySelected) {
        descendantIds.forEach((id) => next.delete(id))
      } else {
        descendantIds.forEach((id) => next.add(id))
      }

      onSelectionChange(next)
    },
    [selectedIds, onSelectionChange]
  )

  // Auto-expand matching nodes when searching
  const autoExpandedIds = useMemo(() => {
    if (searchQuery === '') return expandedIds

    const matching = new Set(expandedIds)
    const expandMatching = (node: GeographyNode) => {
      if (node.children?.some((child) => nodeOrDescendantMatches(child, searchQuery))) {
        matching.add(node.id)
        node.children.forEach(expandMatching)
      }
    }
    expandMatching(data)
    return matching
  }, [searchQuery, expandedIds, data])

  return (
    <div className={cn('space-y-2', className)}>
      {/* Search */}
      {searchable && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-primary/20 focus:border-gov-primary"
          />
        </div>
      )}

      {/* Tree */}
      <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-lg p-2">
        <TreeNode
          node={data}
          selectedIds={selectedIds}
          expandedIds={autoExpandedIds}
          searchQuery={searchQuery}
          depth={0}
          onToggleExpand={handleToggleExpand}
          onToggleSelect={handleToggleSelect}
        />
      </div>

      {/* Selection summary */}
      <div className="flex items-center justify-between text-sm text-slate-500 px-2">
        <span>{selectedIds.size} selected</span>
        <button
          type="button"
          onClick={() => onSelectionChange(new Set())}
          className="text-gov-primary hover:underline"
        >
          Clear all
        </button>
      </div>
    </div>
  )
}

export const HierarchicalFilter = memo(HierarchicalFilterComponent)

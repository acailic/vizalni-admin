# Feature Request

## Title
Hierarchical Data Filters - Tree-based filter selector

## Problem
Current filters are flat lists. For hierarchical data like geographic regions (Country > Region > District > Municipality), users must scroll through hundreds of options. The Swiss visualization tool uses a tree-based selector that shows hierarchy levels with expand/collapse, making navigation much easier.

## Proposed behavior

### Tree Selector Features
- Hierarchical tree structure with expandable nodes
- Search/filter within hierarchy
- Multi-select with parent-child selection modes
- Show counts at each level
- Breadcrumb for current selection
- "Select all children" option

### Integration
- Replace flat dropdown for hierarchical dimensions
- Auto-detect hierarchy from data structure
- Support single and multi-select modes
- Persist expanded state during session

---

## Detailed Implementation

### File 1: `src/types/hierarchy.ts` (new)

```typescript
export interface HierarchyNode {
  id: string
  label: string
  value: string
  depth: number
  hasChildren: boolean
  children?: HierarchyNode[]
  count?: number
  parent?: string | null
}

export interface HierarchyValue extends HierarchyNode {
  isPlaceholder?: boolean
  children?: HierarchyValue[]
}

export type HierarchySelectionMode = 'single' | 'multi' | 'leaf-only'

export interface HierarchicalFilterConfig {
  dimensionId: string
  hierarchy: HierarchyValue[]
  selectionMode: HierarchySelectionMode
  selectedValues: string[]
  expandedNodes: string[]
}
```

### File 2: `src/components/ui/SelectTree.tsx` (new)

```typescript
'use client'

import { memo, useState, useMemo, useCallback } from 'react'
import { cn } from '@/lib/utils/cn'
import type { HierarchyValue, HierarchySelectionMode } from '@/types/hierarchy'

interface SelectTreeProps {
  tree: HierarchyValue[]
  value: string[]
  onChange: (value: string[]) => void
  selectionMode: HierarchySelectionMode
  locale: 'sr-Cyrl' | 'sr-Latn' | 'en'
  searchable?: boolean
  maxHeight?: number
  labels?: {
    search?: string
    selectAll?: string
    clearAll?: string
    expandAll?: string
    collapseAll?: string
  }
}

function SelectTreeComponent({
  tree,
  value,
  onChange,
  selectionMode,
  locale,
  searchable = true,
  maxHeight = 300,
  labels,
}: SelectTreeProps) {
  const l = {
    search: 'Search...',
    selectAll: 'Select all',
    clearAll: 'Clear all',
    expandAll: 'Expand all',
    collapseAll: 'Collapse all',
    ...labels,
  }

  const [searchTerm, setSearchTerm] = useState('')
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  // Flatten tree for search
  const flattenTree = useCallback((nodes: HierarchyValue[], depth = 0): HierarchyValue[] => {
    return nodes.flatMap(node => [
      { ...node, depth },
      ...(node.children ? flattenTree(node.children, depth + 1) : []),
    ])
  }, [])

  // Filter tree based on search
  const filteredNodes = useMemo(() => {
    if (!searchTerm) return tree
    const flat = flattenTree(tree)
    const matching = flat.filter(node =>
      node.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
    // Include parents of matching nodes
    const parentIds = new Set<string>()
    matching.forEach(node => {
      let current = node.parent
      while (current) {
        parentIds.add(current)
        current = flat.find(n => n.value === current)?.parent ?? null
      }
    })
    return flat.filter(n => matching.includes(n) || parentIds.has(n.value))
  }, [tree, searchTerm, flattenTree])

  // Toggle node expansion
  const toggleExpand = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev)
      if (next.has(nodeId)) {
        next.delete(nodeId)
      } else {
        next.add(nodeId)
      }
      return next
    })
  }, [])

  // Handle selection
  const handleSelect = useCallback((node: HierarchyValue) => {
    if (selectionMode === 'single') {
      onChange([node.value])
      return
    }

    // Get all descendant values
    const getDescendants = (n: HierarchyValue): string[] => {
      return [
        n.value,
        ...(n.children?.flatMap(getDescendants) ?? []),
      ]
    }

    const descendants = getDescendants(node)
    const isSelected = value.includes(node.value)

    if (isSelected) {
      // Remove this node and all descendants
      onChange(value.filter(v => !descendants.includes(v)))
    } else {
      // Add this node and all descendants
      onChange([...new Set([...value, ...descendants])])
    }
  }, [value, onChange, selectionMode])

  // Render tree node
  const renderNode = (node: HierarchyValue, depth: number) => {
    const isExpanded = expandedNodes.has(node.value)
    const isSelected = value.includes(node.value)
    const hasChildren = node.children && node.children.length > 0
    const paddingLeft = depth * 20

    return (
      <div key={node.value}>
        <div
          className={cn(
            'flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer transition-colors',
            'hover:bg-slate-100',
            isSelected && 'bg-gov-primary/10'
          )}
          style={{ paddingLeft: paddingLeft + 8 }}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleExpand(node.value)}
              className="w-4 h-4 flex items-center justify-center text-slate-400 hover:text-slate-600"
            >
              <span className={cn('transition-transform', isExpanded && 'rotate-90')}>
                ▶
              </span>
            </button>
          ) : (
            <span className="w-4" />
          )}

          <input
            type={selectionMode === 'single' ? 'radio' : 'checkbox'}
            checked={isSelected}
            onChange={() => handleSelect(node)}
            className="h-4 w-4 rounded border-slate-300 text-gov-primary focus:ring-gov-primary"
          />

          <span
            className={cn('flex-1 text-sm', isSelected && 'font-medium')}
            onClick={() => handleSelect(node)}
          >
            {node.label}
          </span>

          {node.count !== undefined && (
            <span className="text-xs text-slate-400">
              ({node.count})
            </span>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div>
            {node.children!.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="select-tree">
      {searchable && (
        <div className="p-2 border-b border-slate-200">
          <input
            type="text"
            placeholder={l.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm focus:border-gov-primary focus:outline-none focus:ring-1 focus:ring-gov-primary"
          />
        </div>
      )}

      <div className="flex items-center gap-2 border-b border-slate-200 px-2 py-1">
        <button
          type="button"
          onClick={() => {
            const allValues = flattenTree(tree).map(n => n.value)
            onChange(allValues)
          }}
          className="text-xs text-gov-primary hover:underline"
        >
          {l.selectAll}
        </button>
        <span className="text-slate-300">|</span>
        <button
          type="button"
          onClick={() => onChange([])}
          className="text-xs text-gov-primary hover:underline"
        >
          {l.clearAll}
        </button>
      </div>

      <div
        className="overflow-y-auto py-1"
        style={{ maxHeight }}
      >
        {filteredNodes.map(node => renderNode(node, 0))}
      </div>
    </div>
  )
}

export const SelectTree = memo(SelectTreeComponent)
```

### File 3: `src/components/configurator/HierarchicalFilterEditor.tsx` (new)

```typescript
'use client'

import { memo, useMemo } from 'react'
import { SelectTree } from '@/components/ui/SelectTree'
import type { HierarchyValue, HierarchySelectionMode } from '@/types/hierarchy'

interface HierarchicalFilterEditorProps {
  dimensionId: string
  hierarchy: HierarchyValue[]
  selectedValues: string[]
  onSelectionChange: (values: string[]) => void
  locale: 'sr-Cyrl' | 'sr-Latn' | 'en'
  labels?: {
    search?: string
    selectAll?: string
    clearAll?: string
  }
}

function HierarchicalFilterEditorComponent({
  dimensionId,
  hierarchy,
  selectedValues,
  onSelectionChange,
  locale,
  labels,
}: HierarchicalFilterEditorProps) {
  // Auto-detect if this should be single or multi-select based on data
  const selectionMode: HierarchySelectionMode = useMemo(() => {
    // If hierarchy is small or user has only selected one, default to multi
    return 'multi'
  }, [])

  return (
    <div className="rounded-lg border border-slate-200">
      <SelectTree
        tree={hierarchy}
        value={selectedValues}
        onChange={onSelectionChange}
        selectionMode={selectionMode}
        locale={locale}
        searchable
        labels={labels}
      />
    </div>
  )
}

export const HierarchicalFilterEditor = memo(HierarchicalFilterEditorComponent)
```

### File 4: `src/lib/hierarchy-utils.ts` (new)

```typescript
import type { HierarchyValue } from '@/types/hierarchy'

/**
 * Build hierarchy from flat data with parent references
 */
export function buildHierarchy(
  items: Array<{ id: string; label: string; parentId: string | null; count?: number }>
): HierarchyValue[] {
  const itemMap = new Map<string, HierarchyValue>()
  const rootItems: HierarchyValue[] = []

  // First pass: create all nodes
  for (const item of items) {
    itemMap.set(item.id, {
      id: item.id,
      label: item.label,
      value: item.id,
      depth: 0,
      hasChildren: false,
      children: [],
      parent: item.parentId,
      count: item.count,
    })
  }

  // Second pass: build tree structure
  for (const item of items) {
    const node = itemMap.get(item.id)!
    if (item.parentId) {
      const parent = itemMap.get(item.parentId)
      if (parent) {
        parent.children!.push(node)
        parent.hasChildren = true
        node.depth = parent.depth + 1
      }
    } else {
      rootItems.push(node)
    }
  }

  return rootItems
}

/**
 * Get all descendant values from a node
 */
export function getDescendantValues(node: HierarchyValue): string[] {
  const values = [node.value]
  if (node.children) {
    for (const child of node.children) {
      values.push(...getDescendantValues(child))
    }
  }
  return values
}

/**
 * Get ancestor path to a node
 */
export function getAncestorPath(
  node: HierarchyValue,
  allNodes: HierarchyValue[]
): HierarchyValue[] {
  const path = [node]
  let current = node.parent
  while (current) {
    const parent = allNodes.find(n => n.value === current)
    if (parent) {
      path.unshift(parent)
      current = parent.parent
    } else {
      break
    }
  }
  return path
}
```

### File 5: Add translations

**`src/locales/en.json`**:
```json
{
  "hierarchicalFilters": {
    "search": "Search...",
    "selectAll": "Select all",
    "clearAll": "Clear all",
    "expandAll": "Expand all",
    "collapseAll": "Collapse all",
    "selected": "selected",
    "noResults": "No results found"
  }
}
```

**`src/locales/sr-cyr.json`**:
```json
{
  "hierarchicalFilters": {
    "search": "Претрага...",
    "selectAll": "Изабери све",
    "clearAll": "Очисти све",
    "expandAll": "Прошири све",
    "collapseAll": "Сkupi све",
    "selected": "изабрано",
    "noResults": "Нема резултата"
  }
}
```

---

## Affected areas
- `src/types/hierarchy.ts` (new)
- `src/components/ui/SelectTree.tsx` (new)
- `src/components/configurator/HierarchicalFilterEditor.tsx` (new)
- `src/lib/hierarchy-utils.ts` (new)
- `src/components/configurator/filters/` - Integrate with existing filter UI
- `src/locales/*.json` - Translations

## Constraints
- Must handle large hierarchies (1000+ nodes)
- Search must be fast (index on type)
- Keyboard navigation (arrow keys, enter, space)
- Virtual scrolling for performance
- Support 5+ levels of hierarchy

## Out of scope
- Drag-and-drop hierarchy reordering
- Custom hierarchy creation by users
- Hierarchy visualization (tree map)

## Acceptance criteria
- [ ] Tree selector renders hierarchical data
- [ ] Nodes are expandable/collapsible
- [ ] Search filters nodes by label
- [ ] Select all / clear all works
- [ ] Multi-select selects all descendants
- [ ] Selection mode can be single or multi
- [ ] Selected nodes are visually highlighted
- [ ] Counts displayed at each level (when available)
- [ ] Keyboard navigation works
- [ ] Works with 1000+ nodes without lag
- [ ] All text translated in all three locales

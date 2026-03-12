# Feature Request

## Title
Hierarchical Data Filters for Geographic/Administrative Data

## Problem
Serbian geographic data has natural hierarchies (Region → District → Municipality) that flat filter selectors cannot represent well. Users must scroll through long lists of municipalities without context. The Swiss tool uses tree-based selectors that preserve parent-child relationships.

## Proposed behavior

### Filter Features
1. **Tree Structure** - Collapsible hierarchy with parent-child nodes
2. **Multi-select** - Select individual items or entire branches
3. **Search** - Filter tree by text, showing matching nodes and ancestors
4. **Parent Selection** - Selecting parent selects all children
5. **Partial Indicators** - Show indeterminate state when some children selected

### Serbian Geographic Hierarchy
```
Србија (Serbia)
├── Београдски регион (Belgrade Region)
│   ├── Град Београд (City of Belgrade)
│   │   ├── Врачар
│   │   ├── Савски венац
│   │   └── ...
├── Војводина (Vojvodina)
│   ├── Јужнобачки округ
│   ├── Севернобачки округ
│   └── ...
├── Шумадија и западна Србија
│   └── ...
└── Јужна и источна Србија
    └── ...
```

---

## Detailed Implementation

### File 1: `src/components/filters/HierarchicalFilter.tsx` (new)

```typescript
'use client'

import { memo, useMemo, useState, useCallback } from 'react'
import { ChevronDown, ChevronRight, Check, Minus, Search } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export interface HierarchyNode {
  id: string
  label: string
  children?: HierarchyNode[]
}

interface HierarchicalFilterProps {
  data: HierarchyNode
  selectedIds: Set<string>
  onSelectionChange: (selectedIds: Set<string>) => void
  searchable?: boolean
  searchPlaceholder?: string
  locale: 'sr-Cyrl' | 'sr-Latn' | 'en'
}

interface TreeNodeProps {
  node: HierarchyNode
  selectedIds: Set<string>
  expandedIds: Set<string>
  searchQuery: string
  onToggleExpand: (id: string) => void
  onToggleSelect: (node: HierarchyNode, isFullySelected: boolean) => void
  depth: number
}

function getSelectionState(
  node: HierarchyNode,
  selectedIds: Set<string>
): 'all' | 'some' | 'none' {
  if (selectedIds.has(node.id)) {
    // Check if all descendants are also selected
    if (!node.children) return 'all'
    const allDescendantsSelected = getAllDescendantIds(node).every(id => selectedIds.has(id))
    return allDescendantsSelected ? 'all' : 'some'
  }

  if (!node.children) return 'none'

  const descendantIds = getAllDescendantIds(node)
  const selectedCount = descendantIds.filter(id => selectedIds.has(id)).length

  if (selectedCount === 0) return 'none'
  if (selectedCount === descendantIds.length) return 'all'
  return 'some'
}

function getAllDescendantIds(node: HierarchyNode): string[] {
  const ids = [node.id]
  if (node.children) {
    node.children.forEach(child => {
      ids.push(...getAllDescendantIds(child))
    })
  }
  return ids
}

function TreeNode({
  node,
  selectedIds,
  expandedIds,
  searchQuery,
  onToggleExpand,
  onToggleSelect,
  depth
}: TreeNodeProps) {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = expandedIds.has(node.id)
  const selectionState = getSelectionState(node, selectedIds)

  // Check if this node or any descendant matches search
  const matchesSearch = searchQuery === '' ||
    node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (node.children?.some(child =>
      nodeOrDescendantMatches(child, searchQuery)
    ) ?? false)

  if (!matchesSearch) return null

  return (
    <div style={{ marginLeft: depth * 16 }}>
      <div className="flex items-center gap-2 py-1 px-2 rounded hover:bg-slate-100 cursor-pointer">
        {/* Expand/collapse button */}
        {hasChildren ? (
          <button
            onClick={() => onToggleExpand(node.id)}
            className="p-0.5 hover:bg-slate-200 rounded"
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
          onClick={() => onToggleSelect(node, selectionState === 'all')}
          className={cn(
            "w-5 h-5 rounded border flex items-center justify-center transition-colors",
            selectionState === 'all'
              ? "bg-gov-primary border-gov-primary text-white"
              : selectionState === 'some'
              ? "bg-gov-primary/20 border-gov-primary"
              : "border-slate-300 hover:border-gov-primary"
          )}
        >
          {selectionState === 'all' && <Check className="w-3 h-3" />}
          {selectionState === 'some' && <Minus className="w-3 h-3 text-gov-primary" />}
        </button>

        {/* Label */}
        <span className="text-sm text-slate-700">{node.label}</span>

        {/* Children count badge */}
        {hasChildren && (
          <span className="text-xs text-slate-400">
            ({node.children!.length})
          </span>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              selectedIds={selectedIds}
              expandedIds={expandedIds}
              searchQuery={searchQuery}
              onToggleExpand={onToggleExpand}
              onToggleSelect={onToggleSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function nodeOrDescendantMatches(node: HierarchyNode, query: string): boolean {
  if (node.label.toLowerCase().includes(query.toLowerCase())) return true
  return node.children?.some(child => nodeOrDescendantMatches(child, query)) ?? false
}

function HierarchicalFilterComponent({
  data,
  selectedIds,
  onSelectionChange,
  searchable = true,
  searchPlaceholder = 'Search...',
  locale
}: HierarchicalFilterProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const handleToggleSelect = useCallback((
    node: HierarchyNode,
    isFullySelected: boolean
  ) => {
    const descendantIds = getAllDescendantIds(node)
    const next = new Set(selectedIds)

    if (isFullySelected) {
      // Deselect node and all descendants
      descendantIds.forEach(id => next.delete(id))
    } else {
      // Select node and all descendants
      descendantIds.forEach(id => next.add(id))
    }

    onSelectionChange(next)
  }, [selectedIds, onSelectionChange])

  // Auto-expand matching nodes when searching
  const autoExpandedIds = useMemo(() => {
    if (searchQuery === '') return expandedIds

    const matching = new Set(expandedIds)
    const expandMatching = (node: HierarchyNode) => {
      if (node.children?.some(child => nodeOrDescendantMatches(child, searchQuery))) {
        matching.add(node.id)
        node.children.forEach(expandMatching)
      }
    }
    expandMatching(data)
    return matching
  }, [searchQuery, expandedIds, data])

  return (
    <div className="space-y-2">
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
      <div className="max-h-80 overflow-y-auto border border-slate-200 rounded-lg p-2">
        <TreeNode
          node={data}
          selectedIds={selectedIds}
          expandedIds={autoExpandedIds}
          searchQuery={searchQuery}
          onToggleExpand={handleToggleExpand}
          onToggleSelect={handleToggleSelect}
          depth={0}
        />
      </div>

      {/* Selection summary */}
      <div className="flex items-center justify-between text-sm text-slate-500 px-2">
        <span>{selectedIds.size} selected</span>
        <div className="flex gap-2">
          <button
            onClick={() => onSelectionChange(new Set())}
            className="text-gov-primary hover:underline"
          >
            Clear all
          </button>
        </div>
      </div>
    </div>
  )
}

export const HierarchicalFilter = memo(HierarchicalFilterComponent)
```

### File 2: `src/lib/data/serbian-geography.ts` (new)

```typescript
import type { HierarchyNode } from '@/components/filters/HierarchicalFilter'

/**
 * Serbian administrative division hierarchy
 * Based on NUTS and LAU classification
 */
export const serbianGeographyHierarchy: HierarchyNode = {
  id: 'RS',
  label: 'Србија / Srbija',
  children: [
    {
      id: 'RS-BG',
      label: 'Београдски регион / Beogradski region',
      children: [
        {
          id: 'RS-BG-GRAD',
          label: 'Град Београд / Grad Beograd',
          children: [
            { id: 'RS-BG-01', label: 'Врачар / Vračar' },
            { id: 'RS-BG-02', label: 'Савски венац / Savski venac' },
            { id: 'RS-BG-03', label: 'Стари град / Stari grad' },
            { id: 'RS-BG-04', label: 'Палилула / Palilula' },
            { id: 'RS-BG-05', label: 'Звездара / Zvezdara' },
            { id: 'RS-BG-06', label: 'Нови Београд / Novi Beograd' },
            { id: 'RS-BG-07', label: 'Земун / Zemun' },
            { id: 'RS-BG-08', label: 'Раковица / Rakovica' },
            { id: 'RS-BG-09', label: 'Чукарица / Čukarica' },
            { id: 'RS-BG-10', label: 'Обреновац / Obrenovac' },
            { id: 'RS-BG-11', label: 'Лазаревац / Lazarevac' },
            { id: 'RS-BG-12', label: 'Младеновац / Mladenovac' },
            { id: 'RS-BG-13', label: 'Барајево / Barajevo' },
            { id: 'RS-BG-14', label: 'Сурчин / Surčin' },
            { id: 'RS-BG-15', label: 'Гроцка / Grocka' },
            { id: 'RS-BG-16', label: 'Вождовац / Voždovac' },
          ]
        }
      ]
    },
    {
      id: 'RS-VO',
      label: 'Војводина / Vojvodina',
      children: [
        {
          id: 'RS-VO-JB',
          label: 'Јужнобачки округ / Južnobački okrug',
          children: [
            { id: 'RS-VO-JB-01', label: 'Нови Сад / Novi Sad' },
            { id: 'RS-VO-JB-02', label: 'Сремска Митровица / Sremska Mitrovica' },
            { id: 'RS-VO-JB-03', label: 'Бачка Паланка / Bačka Palanka' },
          ]
        },
        {
          id: 'RS-VO-SB',
          label: 'Севернобачки округ / Severnobački okrug',
          children: [
            { id: 'RS-VO-SB-01', label: 'Суботица / Subotica' },
          ]
        },
        {
          id: 'RS-VO-ZB',
          label: 'Западнобачки округ / Zapadnobački okrug',
          children: [
            { id: 'RS-VO-ZB-01', label: 'Сомбор / Sombor' },
          ]
        },
        {
          id: 'RS-VO-BB',
          label: 'Бачкобачки округ / Bačkobački okrug',
          children: [
            { id: 'RS-VO-BB-01', label: 'Бечеј / Bečej' },
          ]
        },
        {
          id: 'RS-VO-SS',
          label: 'Сремски округ / Sremski okrug',
          children: [
            { id: 'RS-VO-SS-01', label: 'Рума / Ruma' },
            { id: 'RS-VO-SS-02', label: 'Ириг / Irig' },
          ]
        },
      ]
    },
    {
      id: 'RS-SZ',
      label: 'Шумадија и западна Србија / Šumadija i zapadna Srbija',
      children: [
        {
          id: 'RS-SZ-01',
          label: 'Шумадијски округ / Šumadijski okrug',
          children: [
            { id: 'RS-SZ-01-01', label: 'Крагујевац / Kragujevac' },
          ]
        },
      ]
    },
    {
      id: 'RS-JI',
      label: 'Јужна и источна Србија / Južna i istočna Srbija',
      children: [
        {
          id: 'RS-JI-01',
          label: 'Нишавски округ / Nišavski okrug',
          children: [
            { id: 'RS-JI-01-01', label: 'Ниш / Niš' },
          ]
        },
      ]
    },
    {
      id: 'RS-KM',
      label: 'Косово и Метохија / Kosovo i Metohija',
      children: []
    }
  ]
}

export function getGeographyLabel(id: string, locale: 'sr-Cyrl' | 'sr-Latn' | 'en'): string {
  // Find node by ID and extract appropriate label part
  const findNode = (node: HierarchyNode, targetId: string): HierarchyNode | null => {
    if (node.id === targetId) return node
    if (node.children) {
      for (const child of node.children) {
        const found = findNode(child, targetId)
        if (found) return found
      }
    }
    return null
  }

  const node = findNode(serbianGeographyHierarchy, id)
  if (!node) return id

  // Labels are in format "Cyrillic / Latin"
  const parts = node.label.split(' / ')
  if (locale === 'sr-Cyrl') return parts[0]
  if (locale === 'sr-Latn') return parts[1] ?? parts[0]
  return parts[1] ?? parts[0] // English uses Latin
}
```

### File 3: Update `src/components/configurator/DatasetStep.tsx`

Add hierarchical filter for geographic data:

```typescript
import { HierarchicalFilter, serbianGeographyHierarchy } from '@/components/filters/HierarchicalFilter'

// In the filter section:
{hasGeographicDimension && (
  <div className="space-y-2">
    <label className="text-sm font-medium text-slate-700">
      Geographic Filter
    </label>
    <HierarchicalFilter
      data={serbianGeographyHierarchy}
      selectedIds={selectedGeoIds}
      onSelectionChange={setSelectedGeoIds}
      locale={locale}
    />
  </div>
)}
```

---

## Affected areas
- `src/components/filters/HierarchicalFilter.tsx` (new) - Tree filter component
- `src/lib/data/serbian-geography.ts` (new) - Serbian geographic hierarchy data
- `src/components/configurator/DatasetStep.tsx` - Add geographic filter
- `src/components/charts/shared/FilterPillsFromState.tsx` - Handle hierarchical pills
- `src/locales/*.json` - Add translations

## Constraints
- Must handle 3+ levels of nesting
- Search must work with Cyrillic and Latin scripts
- Performance with 200+ municipalities
- Mobile-friendly scrollable container

## Out of scope
- Dynamic hierarchy from API (static data for now)
- Custom user hierarchies
- Drag-and-drop reordering

## Acceptance criteria
- [ ] Tree renders with correct hierarchy
- [ ] Clicking expand/collapse toggles visibility
- [ ] Selecting parent selects all children
- [ ] Partial selection shows indeterminate state
- [ ] Search filters visible nodes
- [ ] Search auto-expands matching branches
- [ ] Selection count displays correctly
- [ ] Clear all removes all selections
- [ ] Works with Cyrillic and Latin scripts

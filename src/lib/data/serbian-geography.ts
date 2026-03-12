/**
 * Serbian Administrative Geography Data
 *
 * Hierarchical structure of Serbia's administrative divisions
 * based on NUTS2 statistical regions and LAU municipalities.
 *
 * Labels are bilingual (Cyrillic / Latin) for i18n support.
 */

export interface GeographyNode {
  id: string
  label: string
  children?: GeographyNode[]
}

/**
 * Serbian administrative division hierarchy
 * Based on NUTS2 statistical regions and LAU municipalities
 */
export const serbianGeographyHierarchy: GeographyNode = {
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
            { id: 'RS-BG-VRACAR', label: 'Врачар / Vračar' },
            { id: 'RS-BG-SAVSKI', label: 'Савски венац / Savski venac' },
            { id: 'RS-BG-STARI', label: 'Стари град / Stari grad' },
            { id: 'RS-BG-PALILULA', label: 'Палилула / Palilula' },
            { id: 'RS-BG-ZVEZDARA', label: 'Звездара / Zvezdara' },
            { id: 'RS-BG-NOVI', label: 'Нови Београд / Novi Beograd' },
            { id: 'RS-BG-ZEMUN', label: 'Земун / Zemun' },
            { id: 'RS-BG-RAKOVICA', label: 'Раковица / Rakovica' },
            { id: 'RS-BG-CUKARICA', label: 'Чукарица / Čukarica' },
          ],
        },
      ],
    },
    {
      id: 'RS-VO',
      label: 'Војводина / Vojvodina',
      children: [
        {
          id: 'RS-VO-JB',
          label: 'Јужнобачки округ / Južnobački okrug',
          children: [
            { id: 'RS-VO-NS', label: 'Нови Сад / Novi Sad' },
            { id: 'RS-VO-SM', label: 'Сремска Митровица / Sremska Mitrovica' },
            { id: 'RS-VO-BP', label: 'Бачка Паланка / Bačka Palanka' },
          ],
        },
        {
          id: 'RS-VO-SB',
          label: 'Севернобачки округ / Severnobački okrug',
          children: [{ id: 'RS-VO-SU', label: 'Суботица / Subotica' }],
        },
        {
          id: 'RS-VO-ZB',
          label: 'Западнобачки округ / Zapadnobački okrug',
          children: [{ id: 'RS-VO-SO', label: 'Сомбор / Sombor' }],
        },
      ],
    },
    {
      id: 'RS-SZ',
      label: 'Шумадија и западна Србија / Šumadija i zapadna Srbija',
      children: [
        {
          id: 'RS-SZ-SU',
          label: 'Шумадијски округ / Šumadijski okrug',
          children: [{ id: 'RS-SZ-KG', label: 'Крагујевац / Kragujevac' }],
        },
      ],
    },
    {
      id: 'RS-JI',
      label: 'Јужна и источна Србија / Južna i istočna Srbija',
      children: [
        {
          id: 'RS-JI-NI',
          label: 'Нишавски округ / Nišavski okrug',
          children: [{ id: 'RS-JI-NIS', label: 'Ниш / Niš' }],
        },
      ],
    },
  ],
}

/**
 * Get label for a geography ID based on locale
 */
export function getGeographyLabel(
  id: string,
  locale: 'sr-Cyrl' | 'sr-Latn' | 'en'
): string {
  const findNode = (node: GeographyNode, targetId: string): GeographyNode | null => {
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
  if (locale === 'sr-Cyrl') return parts[0] ?? id
  return parts[1] ?? parts[0] ?? id
}

/**
 * Get all descendant IDs for a node (including the node itself)
 */
export function getAllDescendantIds(node: GeographyNode): string[] {
  const ids = [node.id]
  if (node.children) {
    for (const child of node.children) {
      ids.push(...getAllDescendantIds(child))
    }
  }
  return ids
}

/**
 * Find a node by ID
 */
export function findGeographyNode(
  id: string
): GeographyNode | null {
  const findNode = (node: GeographyNode, targetId: string): GeographyNode | null => {
    if (node.id === targetId) return node
    if (node.children) {
      for (const child of node.children) {
        const found = findNode(child, targetId)
        if (found) return found
      }
    }
    return null
  }

  return findNode(serbianGeographyHierarchy, id)
}

/**
 * Get all regions (top-level children)
 */
export function getRegions(): GeographyNode[] {
  return serbianGeographyHierarchy.children ?? []
}

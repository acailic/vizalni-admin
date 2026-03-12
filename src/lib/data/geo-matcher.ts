import type { GeoLevel } from '@/types'

export interface GeoMatchResult {
  matchRate: number
  matched: Map<string, string>
  unmatched: string[]
}

// Normalize string for comparison
function normalize(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s]/g, '') // Remove special chars
    .replace(/\s+/g, ' ')
}

// Levenshtein distance for fuzzy matching
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0]![j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i]![j] = matrix[i - 1]![j - 1]!
      } else {
        matrix[i]![j] = Math.min(
          matrix[i - 1]![j - 1]! + 1,
          matrix[i]![j - 1]! + 1,
          matrix[i - 1]![j]! + 1
        )
      }
    }
  }

  return matrix[b.length]![a.length]!
}

// Known geographic names for each level
const REGION_NAMES: Record<string, string[]> = {
  RS00: ['beogradski region', 'beograd', 'belgrade', 'београдски регион', 'београд'],
  RS10: ['vojvodina', 'војводина'],
  RS11: [
    'sumadija i zapadna srbija',
    'šumadija i zapadna srbija',
    'шумадија и западна србија',
  ],
  RS12: [
    'juzna i istocna srbija',
    'južna i istočna srbija',
    'јужна и источна србија',
  ],
  RS13: [
    'kosovo i metohija',
    'kosovo',
    'косово и метохија',
    'косово',
  ],
}

const DISTRICT_NAMES: Record<string, string[]> = {
  '00': ['grad beograd', 'beograd', 'belgrade', 'град београд', 'београд'],
  '01': ['severnobacki', 'severnobački', 'севернобачки'],
  '02': ['srednjobacki', 'средњобачки'],
  '03': ['juznobacki', 'južnobački', 'јужнобачки'],
  '04': ['zapadnobacki', 'западнобачки'],
  '05': ['severnobanatski', 'севернобанатски'],
  '06': ['srednjobanatski', 'средњобанатски'],
  '07': ['juznobanatski', 'južnobanatski', 'јужнобанатски'],
  '08': ['sremski', 'сремски'],
  '09': ['macvanski', 'mačvanski', 'мачвански'],
  '10': ['kolubarski', 'колубарски'],
  '11': ['podunavski', 'подунавски'],
  '12': ['branicevski', 'браничевски'],
  '13': ['sumadijski', 'šumadijski', 'шумадијски'],
  '14': ['pomoravski', 'поморавски'],
  '15': ['borski', 'борски'],
  '16': ['zajecarski', 'зајечарски'],
  '17': ['raski', 'рашки'],
  '18': ['rasinski', 'расински'],
  '19': ['toplicki', 'toplički', 'топлички'],
  '20': ['pirotski', 'пиротски'],
  '21': ['jablanicki', 'jablanički', 'јабланички'],
  '22': ['nisavski', 'нишавски'],
  '23': ['pcinjski', 'pčinjski', 'пчињски'],
  '24': ['zlatiborski', 'златиборски'],
  '25': ['moravicki', 'morički', 'моравички'],
  '26': ['kosovski', 'косовски'],
  '27': ['pecki', 'пећки'],
  '28': ['prizrenski', 'призренски'],
  '29': ['kosovskomitrovacki', 'косовскомитровачки'],
  '30': ['kosovskopomoravski', 'косовскопоморавски'],
}

// Municipality names (key municipalities for matching)
const MUNICIPALITY_NAMES: Record<string, string[]> = {
  '001': ['ada', 'ада'],
  '002': ['apatin', 'апатин'],
  '003': ['bac', 'бач'],
  '004': ['backa palanka', 'бачка паланка'],
  '005': ['backa topola', 'бачка топола'],
  '006': ['backi petrovac', 'бачки петровац'],
  '007': ['beograd', 'belgrade', 'београд'],
  '008': ['beocin', 'беочин'],
  '009': ['becej', 'бечеј'],
  '010': ['vrbas', 'врбас'],
  '011': ['vrsac', 'вршац'],
  '012': ['zabalj', 'жабаљ'],
  '013': ['zitiste', 'житиште'],
  '014': ['zrenjanin', 'зрењанин'],
  '015': ['indjija', 'инђија'],
  '016': ['kanjiza', 'канижа'],
  '017': ['kikinda', 'кикинда'],
  '018': ['kovacica', 'ковачица'],
  '019': ['kovin', 'ковин'],
  '020': ['kula', 'кула'],
  '021': ['mali idjos', 'мали иђош'],
  '022': ['mol', 'мол'],
  '023': ['novi sad', 'нови сад'],
  '024': ['senta', 'сента'],
  '025': ['sombor', 'сомбор'],
  '026': ['srbobran', 'србобран'],
  '027': ['sremska mitrovica', 'сремска митровица'],
  '028': ['subotica', 'суботица'],
  '029': ['temerin', 'темерин'],
  '030': ['sid', 'шид'],
  '031': ['pancevo', 'панчево'],
  '032': ['sabac', 'шабац'],
  '033': ['loznica', 'лозница'],
  '034': ['valjevo', 'ваљево'],
  '035': ['obrenovac', 'обреновац'],
  '036': ['smederevo', 'смедерево'],
  '037': ['pozarevac', 'пожаревац'],
  '038': ['kragujevac', 'крагујевац'],
  '039': ['jagodina', 'јагодина'],
  '040': ['bor', 'бор'],
  '041': ['zajecar', 'зајечар'],
  '042': ['kraljevo', 'краљево'],
  '043': ['novi pazar', 'нови пазар'],
  '044': ['krusevac', 'крушевац'],
  '045': ['prokuplje', 'прокупље'],
  '046': ['pirot', 'пирот'],
  '047': ['leskovac', 'лесковац'],
  '048': ['nis', 'niš', 'ниш'],
  '049': ['vranje', 'врање'],
  '050': ['uzice', 'ужице'],
  '051': ['cacak', 'čačak', 'чачак'],
  '052': ['pristina', 'приштина'],
  '053': ['prizren', 'призрен'],
  '054': ['pec', 'пећ'],
  '055': ['kosovska mitrovica', 'косовска митровица'],
}

function getNamesForLevel(level: GeoLevel): Record<string, string[]> {
  switch (level) {
    case 'region':
      return REGION_NAMES
    case 'district':
      return DISTRICT_NAMES
    case 'municipality':
      return MUNICIPALITY_NAMES
    default:
      return {}
  }
}

export function matchGeoColumn(
  values: string[],
  geoLevel: GeoLevel
): GeoMatchResult {
  const namesMap = getNamesForLevel(geoLevel)
  const matched = new Map<string, string>()
  const unmatched: string[] = []
  const uniqueValues = [...new Set(values.filter(v => v.trim() !== ''))]

  for (const value of uniqueValues) {
    const normalizedValue = normalize(value)
    let matchedId: string | null = null

    // 1. Exact match on normalized names
    for (const [id, names] of Object.entries(namesMap)) {
      if (names.some(name => normalize(name) === normalizedValue)) {
        matchedId = id
        break
      }
    }

    // 2. Code match (if value looks like a code)
    if (!matchedId && /^\d+$/.test(value)) {
      const code = value.padStart(2, '0')
      if (namesMap[code]) {
        matchedId = code
      }
    }

    // 3. Fuzzy match (Levenshtein distance < 2)
    if (!matchedId) {
      for (const [id, names] of Object.entries(namesMap)) {
        for (const name of names) {
          const normalized = normalize(name)
          const distance = levenshteinDistance(normalizedValue, normalized)
          const threshold = Math.max(2, Math.floor(normalized.length * 0.1))

          if (distance <= threshold) {
            matchedId = id
            break
          }
        }
        if (matchedId) break
      }
    }

    if (matchedId) {
      matched.set(value, matchedId)
    } else {
      unmatched.push(value)
    }
  }

  const matchRate = uniqueValues.length > 0 ? matched.size / uniqueValues.length : 0

  return {
    matchRate,
    matched,
    unmatched,
  }
}

// Get all known geographic names for a level (useful for classifier)
export function getAllGeoNames(geoLevel: GeoLevel): Set<string> {
  const namesMap = getNamesForLevel(geoLevel)
  const allNames = new Set<string>()

  for (const names of Object.values(namesMap)) {
    for (const name of names) {
      allNames.add(normalize(name))
    }
  }

  return allNames
}

// Check if a column might contain geographic data
export function detectGeoLevel(values: string[]): GeoLevel | null {
  const levels: GeoLevel[] = ['region', 'district', 'municipality']

  for (const level of levels) {
    const result = matchGeoColumn(values, level)
    if (result.matchRate >= 0.5) {
      return level
    }
  }

  return null
}

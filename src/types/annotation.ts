export interface Annotation {
  key: string
  title: Record<string, string> // locale -> title
  description?: Record<string, string> // locale -> description
  targets: Array<{
    componentId: string
    value: string | number
  }>
  color?: string
  style: 'filled' | 'outline'
  defaultOpen: boolean
}

export interface ChartAnnotation extends Annotation {
  x: number
  y: number
  visible: boolean
}

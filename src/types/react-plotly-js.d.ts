declare module 'react-plotly.js' {
  import * as React from 'react'

  import type { Config, Data, Layout } from 'plotly.js-dist-min'

  interface PlotProps {
    data: Data[]
    layout?: Partial<Layout>
    config?: Partial<Config>
    className?: string
    style?: React.CSSProperties
    useResizeHandler?: boolean
  }

  export default class Plot extends React.Component<PlotProps> {}
}

import { useInteractiveFiltersStore } from '@/stores/interactive-filters'

describe('interactive filters store', () => {
  beforeEach(() => {
    useInteractiveFiltersStore.setState(state => ({
      ...state,
      charts: {},
      defaults: {},
    }))
  })

  it('initializes chart state and resets to defaults', () => {
    useInteractiveFiltersStore.getState().initializeChart({
      chartId: 'chart-1',
      legend: { total: true },
      timeRange: { from: null, to: null },
      timeSlider: null,
      dataFilters: { region: null },
      calculation: 'absolute',
    })

    useInteractiveFiltersStore.getState().toggleLegendItem('chart-1', 'total')
    useInteractiveFiltersStore.getState().setDataFilter('chart-1', 'region', 'Beograd')
    useInteractiveFiltersStore.getState().setCalculation('chart-1', 'percent')

    expect(useInteractiveFiltersStore.getState().charts['chart-1']).toEqual({
      legend: { total: false },
      timeRange: { from: null, to: null },
      timeSlider: null,
      dataFilters: { region: 'Beograd' },
      calculation: 'percent',
    })

    useInteractiveFiltersStore.getState().resetAll('chart-1')

    expect(useInteractiveFiltersStore.getState().charts['chart-1']).toEqual({
      legend: { total: true },
      timeRange: { from: null, to: null },
      timeSlider: null,
      dataFilters: { region: null },
      calculation: 'absolute',
    })
  })

  it('supports replacing legend visibility wholesale', () => {
    useInteractiveFiltersStore.getState().initializeChart({
      chartId: 'chart-2',
      legend: { primary: true, secondary: true },
      timeRange: { from: null, to: null },
      timeSlider: null,
      dataFilters: {},
      calculation: 'absolute',
    })

    useInteractiveFiltersStore.getState().setLegendState('chart-2', {
      primary: false,
      secondary: true,
    })

    expect(useInteractiveFiltersStore.getState().charts['chart-2']?.legend).toEqual({
      primary: false,
      secondary: true,
    })
  })
})

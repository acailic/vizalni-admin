import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { DimensionFilter } from '@/components/filters/DimensionFilter'
import type { FilterableDimension } from '@/lib/charts/interactive-filters'

const checkboxDimension: FilterableDimension = {
  key: 'region',
  label: 'Region',
  mode: 'checkbox',
  options: [
    { value: 'Beograd', label: 'Beograd' },
    { value: 'Novi Sad', label: 'Novi Sad' },
    { value: 'Niš', label: 'Niš' },
  ],
}

const multiDimension: FilterableDimension = {
  key: 'municipality',
  label: 'Municipality',
  mode: 'multi',
  options: [
    { value: 'Beograd', label: 'Beograd' },
    { value: 'Novi Sad', label: 'Novi Sad' },
    { value: 'Niš', label: 'Niš' },
    { value: 'Kragujevac', label: 'Kragujevac' },
    { value: 'Subotica', label: 'Subotica' },
    { value: 'Čačak', label: 'Čačak' },
    { value: 'Šabac', label: 'Šabac' },
    { value: 'Užice', label: 'Užice' },
    { value: 'Zrenjanin', label: 'Zrenjanin' },
    { value: 'Sombor', label: 'Sombor' },
  ],
}

describe('DimensionFilter', () => {
  it('supports multi-select behavior for checkbox dimensions', () => {
    const handleChange = jest.fn()

    const { rerender } = render(
      React.createElement(DimensionFilter, {
        dimension: checkboxDimension,
        value: null,
        allLabel: 'All',
        searchLabel: 'Search...',
        noResultsLabel: 'No results',
        onChange: handleChange,
      })
    )

    const beograd = screen.getByLabelText('Beograd')
    const noviSad = screen.getByLabelText('Novi Sad')

    fireEvent.click(beograd)
    expect(handleChange).toHaveBeenLastCalledWith(['Beograd'])

    rerender(
      React.createElement(DimensionFilter, {
        dimension: checkboxDimension,
        value: ['Beograd'],
        allLabel: 'All',
        searchLabel: 'Search...',
        noResultsLabel: 'No results',
        onChange: handleChange,
      })
    )

    fireEvent.click(screen.getByLabelText('Novi Sad'))
    expect(handleChange).toHaveBeenLastCalledWith(['Beograd', 'Novi Sad'])
  })

  it('shows a no-results message when multi-select search matches nothing', () => {
    const handleChange = jest.fn()

    render(
      React.createElement(DimensionFilter, {
        dimension: multiDimension,
        value: null,
        allLabel: 'All',
        searchLabel: 'Search...',
        noResultsLabel: 'No results',
        onChange: handleChange,
      })
    )

    fireEvent.change(screen.getByPlaceholderText('Search...'), {
      target: { value: 'xyz' },
    })

    expect(screen.getByText('No results')).toBeInTheDocument()
  })
})

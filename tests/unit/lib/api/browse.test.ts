jest.mock('react', () => ({
  ...jest.requireActual('react'),
  cache: <T extends (...args: never[]) => unknown>(fn: T) => fn,
}))

import {
  buildFormatFacetOptions,
  findPreviewableResource,
  isAllowedPreviewHost,
  normalizeBrowseSearchParams,
  parsePreviewData,
} from '@/lib/api/browse'

describe('browse utilities', () => {
  it('normalizes search params with sane defaults', () => {
    expect(
      normalizeBrowseSearchParams({
        q: ' budget ',
        page: '2',
        organization: 'ministry-of-finance',
      })
    ).toEqual({
      q: 'budget',
      page: 2,
      pageSize: 12,
      organization: 'ministry-of-finance',
      topic: undefined,
      format: undefined,
      frequency: undefined,
      sort: '-last_update',
    })
  })

  it('parses json preview payloads', () => {
    expect(parsePreviewData('[{"name":"Belgrade","value":10}]', 'json')).toEqual({
      columns: ['name', 'value'],
      rows: [{ name: 'Belgrade', value: '10' }],
      format: 'json',
    })
  })

  it('parses csv preview payloads', () => {
    expect(parsePreviewData('name;value;date\nNovi Sad;1.234,50;01.02.2024.', 'csv')).toEqual({
      columns: ['name', 'value', 'date'],
      rows: [{ name: 'Novi Sad', value: '1234.5', date: '2024-02-01' }],
      format: 'csv',
    })
  })

  it('restricts preview hosts to data.gov.rs', () => {
    expect(isAllowedPreviewHost('data.gov.rs')).toBe(true)
    expect(isAllowedPreviewHost('www.data.gov.rs')).toBe(true)
    expect(isAllowedPreviewHost('example.com')).toBe(false)
  })

  it('prefers the smallest previewable resource', () => {
    expect(
      findPreviewableResource([
        {
          id: '1',
          title: 'Large CSV',
          format: 'csv',
          url: 'https://data.gov.rs/large.csv',
          filesize: 5_000_000,
        },
        {
          id: '2',
          title: 'Small JSON',
          format: 'json',
          url: 'https://data.gov.rs/small.json',
          filesize: 250_000,
        },
        {
          id: '3',
          title: 'Unsupported XML',
          format: 'xml',
          url: 'https://data.gov.rs/data.xml',
          filesize: 100,
        },
      ])
    )?.toMatchObject({
      id: '2',
      format: 'json',
    })
  })

  it('builds unique sorted format facets from the current dataset page', () => {
    expect(
      buildFormatFacetOptions([
        {
          id: 'dataset-1',
          slug: 'dataset-1',
          title: 'Dataset 1',
          created_at: '2026-01-01',
          resources: [
            { id: '1', title: 'CSV', format: 'csv', url: 'https://data.gov.rs/a.csv' },
            { id: '2', title: 'JSON', format: 'json', url: 'https://data.gov.rs/a.json' },
          ],
          tags: [],
        },
        {
          id: 'dataset-2',
          slug: 'dataset-2',
          title: 'Dataset 2',
          created_at: '2026-01-01',
          resources: [
            { id: '3', title: 'CSV 2', format: 'csv', url: 'https://data.gov.rs/b.csv' },
          ],
          tags: [],
        },
      ])
    ).toEqual([
      { value: 'csv', label: 'CSV' },
      { value: 'json', label: 'JSON' },
    ])
  })

  it('preserves a selected format even when the current result page is empty', () => {
    expect(buildFormatFacetOptions([], 'xlsx')).toEqual([{ value: 'xlsx', label: 'XLSX' }])
  })
})

jest.mock('@/lib/data', () => ({
  loadDatasetFromUrl: jest.fn(),
}))

import { loadDatasetFromUrl } from '@/lib/data'
import { DataGovService } from '@/services/dataGovService'

const mockedLoadDatasetFromUrl = jest.mocked(loadDatasetFromUrl)

describe('DataGovService.fetchResourceData', () => {
  beforeEach(() => {
    mockedLoadDatasetFromUrl.mockReset()
  })

  it('delegates to the shared loader', async () => {
    const service = new DataGovService()
    const parsedDataset = {
      observations: [{ opstina: 'Zemun', broj: 12 }],
      dimensions: [],
      measures: [],
      metadataColumns: [],
      columns: ['opstina', 'broj'],
      rowCount: 1,
      source: {
        resourceUrl: 'https://data.gov.rs/resource.json',
        format: 'json',
      },
    }

    mockedLoadDatasetFromUrl.mockResolvedValue(parsedDataset)

    await expect(
      service.fetchResourceData('https://data.gov.rs/resource.json', 'json', {
        resourceId: 'res-1',
      })
    ).resolves.toEqual(parsedDataset)

    expect(mockedLoadDatasetFromUrl).toHaveBeenCalledWith('https://data.gov.rs/resource.json', {
      resourceUrl: 'https://data.gov.rs/resource.json',
      format: 'json',
      resourceId: 'res-1',
    })
  })

  it('maps loader failures through handleError', async () => {
    const service = new DataGovService()
    mockedLoadDatasetFromUrl.mockRejectedValue(new Error('boom'))

    await expect(service.fetchResourceData('https://data.gov.rs/bad.csv', 'csv')).rejects.toEqual(
      expect.objectContaining({
        message: 'An unexpected error occurred',
      })
    )
  })
})

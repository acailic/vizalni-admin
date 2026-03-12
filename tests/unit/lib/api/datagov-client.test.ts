import {
  datasets,
  organizations,
  reuses,
  topics,
  clearCache,
  DataGovAPIError,
  dataGovAPI,
} from '@/lib/api/datagov-client'

describe('DataGovAPI exports', () => {
  it('exports datasets API object', () => {
    expect(datasets).toBeDefined()
    expect(typeof datasets.list).toBe('function')
    expect(typeof datasets.get).toBe('function')
    expect(typeof datasets.resources).toBe('function')
    expect(typeof datasets.getResource).toBe('function')
    expect(typeof datasets.suggest).toBe('function')
    expect(typeof datasets.frequencies).toBe('function')
    expect(typeof datasets.licenses).toBe('function')
    expect(typeof datasets.resourceTypes).toBe('function')
    expect(typeof datasets.badges).toBe('function')
    expect(typeof datasets.communityResources).toBe('function')
  })

  it('exports organizations API object', () => {
    expect(organizations).toBeDefined()
    expect(typeof organizations.list).toBe('function')
    expect(typeof organizations.get).toBe('function')
    expect(typeof organizations.datasets).toBe('function')
    expect(typeof organizations.reuses).toBe('function')
    expect(typeof organizations.suggest).toBe('function')
    expect(typeof organizations.badges).toBe('function')
  })

  it('exports reuses API object', () => {
    expect(reuses).toBeDefined()
    expect(typeof reuses.list).toBe('function')
    expect(typeof reuses.get).toBe('function')
    expect(typeof reuses.suggest).toBe('function')
    expect(typeof reuses.topics).toBe('function')
    expect(typeof reuses.types).toBe('function')
  })

  it('exports topics API object', () => {
    expect(topics).toBeDefined()
    expect(typeof topics.list).toBe('function')
    expect(typeof topics.get).toBe('function')
  })

  it('exports clearCache function', () => {
    expect(typeof clearCache).toBe('function')
  })

  it('exports DataGovAPIError class', () => {
    expect(DataGovAPIError).toBeDefined()
    const error = new DataGovAPIError('Test error', 404, 'Not Found', '/test')
    expect(error.message).toBe('Test error')
    expect(error.status).toBe(404)
    expect(error.statusText).toBe('Not Found')
    expect(error.endpoint).toBe('/test')
    expect(error.name).toBe('DataGovAPIError')
  })

  it('exports dataGovAPI singleton', () => {
    expect(dataGovAPI).toBeDefined()
    expect(dataGovAPI.datasets).toBe(datasets)
    expect(dataGovAPI.organizations).toBe(organizations)
    expect(dataGovAPI.reuses).toBe(reuses)
    expect(dataGovAPI.topics).toBe(topics)
    expect(typeof dataGovAPI.clearCache).toBe('function')
    expect(typeof dataGovAPI.clearExpiredCache).toBe('function')
  })
})

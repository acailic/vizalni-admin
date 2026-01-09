/**
 * API client for data.gov.rs
 *
 * This client provides access to the Serbian Open Data Portal API
 * See: https://data.gov.rs/apidoc/
 *
 * In production (GitHub Pages), routes through Cloudflare Worker proxy.
 * Set NEXT_PUBLIC_API_PROXY_URL to your deployed worker URL.
 */
const DIRECT_API_URL = "https://data.gov.rs/api/1";
function getDefaultApiUrl() {
  const proxyUrl = process.env.NEXT_PUBLIC_API_PROXY_URL;
  const useProxy =
    process.env.NODE_ENV === "production" ||
    process.env.NEXT_PUBLIC_USE_PROXY === "true";
  if (useProxy && proxyUrl) {
    return `${proxyUrl}/api/data-gov`;
  }
  return process.env.DATA_GOV_RS_API_URL || DIRECT_API_URL;
}
export class DataGovRsClient {
  constructor(config) {
    this.config = {
      apiUrl: config.apiUrl || getDefaultApiUrl(),
      apiKey: config.apiKey || process.env.DATA_GOV_RS_API_KEY,
      defaultPageSize: config.defaultPageSize || 20,
      timeout: config.timeout || 10000,
    };
  }
  /**
   * Make an API request
   */
  async request(endpoint, options = {}) {
    const url = `${this.config.apiUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Accept-Language": "sr",
      ...options.headers,
    };
    // Add API key if available
    if (this.config.apiKey) {
      headers["X-API-KEY"] = this.config.apiKey;
    }
    const fetchPromise = (async () => {
      const response = await fetch(url, {
        ...options,
        headers,
      });
      if (!response.ok) {
        const error = {
          message: `API request failed: ${response.statusText}`,
          status: response.status,
        };
        try {
          const errorData = await response.json();
          error.details = errorData;
        } catch (_a) {
          // Ignore JSON parse errors for error responses
        }
        throw error;
      }
      return response.json();
    })();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () =>
          reject({
            message: "Request timeout",
            status: 408,
          }),
        this.config.timeout
      )
    );
    return Promise.race([fetchPromise, timeoutPromise]);
  }
  /**
   * Search datasets
   */
  async searchDatasets(params = {}) {
    const queryParts = [];
    if (params.q) queryParts.push(["q", params.q]);
    if (!params.q && params.organization)
      queryParts.push(["organization", params.organization]);
    if (params.page) queryParts.push(["page", params.page]);
    queryParts.push([
      "page_size",
      (params === null || params === void 0 ? void 0 : params.page_size) ??
        this.config.defaultPageSize,
    ]);
    if (params.q && params.organization)
      queryParts.push(["organization", params.organization]);
    if (params.tag) queryParts.push(["tag", params.tag]);
    if (params.sort) queryParts.push(["sort", params.sort]);
    if (params.order) queryParts.push(["order", params.order]);
    const query = queryParts
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
      )
      .join("&");
    const endpoint = `/datasets/${query ? `?${query}` : ""}`;
    return this.request(endpoint);
  }
  /**
   * Get a specific dataset by ID
   */
  async getDataset(id) {
    return this.request(`/datasets/${id}/`);
  }
  /**
   * List all organizations
   */
  async listOrganizations(page = 1, pageSize = this.config.defaultPageSize) {
    return this.request(`/organizations/?page=${page}&page_size=${pageSize}`);
  }
  /**
   * Search organizations (alias for listOrganizations for test compatibility)
   */
  async searchOrganizations(params = {}) {
    return this.listOrganizations(
      params.page || 1,
      params.page_size || this.config.defaultPageSize
    );
  }
  /**
   * Get a specific organization by ID
   */
  async getOrganization(id) {
    return this.request(`/organizations/${id}/`);
  }
  /**
   * Get datasets for a specific organization
   */
  async getOrganizationDatasets(
    organizationId,
    page = 1,
    pageSize = this.config.defaultPageSize
  ) {
    return this.searchDatasets({
      organization: organizationId,
      page,
      page_size: pageSize,
    });
  }
  /**
   * Get a specific resource by ID
   */
  async getResource(id) {
    return this.request(`/resources/${id}/`);
  }
  /**
   * Download resource data
   */
  async downloadResource(url) {
    return fetch(url);
  }
  /**
   * Get resource data as text
   */
  async getResourceData(resource) {
    const response = await this.downloadResource(resource.url);
    return response.text();
  }
  /**
   * Get resource data as JSON
   */
  async getResourceJSON(resource) {
    const response = await this.downloadResource(resource.url);
    return response.json();
  }
  /**
   * Get resource data as ArrayBuffer
   */
  async getResourceArrayBuffer(resource) {
    const response = await this.downloadResource(resource.url);
    return response.arrayBuffer();
  }
  /**
   * Get all pages of a paginated response
   */
  async *getAllPages(firstPage, fetcher) {
    yield firstPage.data;
    let currentPage = firstPage.page;
    const totalPages = Math.ceil(firstPage.total / firstPage.page_size);
    while (currentPage < totalPages) {
      currentPage++;
      const nextPage = await fetcher(currentPage);
      yield nextPage.data;
    }
  }
}
/**
 * Create a default client instance
 */
export function createDataGovRsClient(config) {
  return new DataGovRsClient({
    apiUrl:
      (config === null || config === void 0 ? void 0 : config.apiUrl) ||
      process.env.DATA_GOV_RS_API_URL ||
      "https://data.gov.rs/api/1",
    apiKey:
      (config === null || config === void 0 ? void 0 : config.apiKey) ||
      process.env.DATA_GOV_RS_API_KEY,
    defaultPageSize:
      (config === null || config === void 0
        ? void 0
        : config.defaultPageSize) || 20,
    timeout:
      (config === null || config === void 0 ? void 0 : config.timeout) || 10000,
  });
}
/**
 * Default client instance
 */
export const dataGovRsClient = createDataGovRsClient();

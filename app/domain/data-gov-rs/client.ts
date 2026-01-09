/**
 * API client for data.gov.rs
 *
 * This client provides access to the Serbian Open Data Portal API
 * See: https://data.gov.rs/apidoc/
 *
 * In production (GitHub Pages), routes through Cloudflare Worker proxy.
 * Set NEXT_PUBLIC_API_PROXY_URL to your deployed worker URL.
 */

import type {
  DatasetMetadata,
  Organization,
  Resource,
  PaginatedResponse,
  SearchParams,
  DataGovRsConfig,
  ApiError,
  RetryConfig,
} from "./types";

const DIRECT_API_URL = "https://data.gov.rs/api/1";

const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
  retryableErrors: ["ECONNRESET", "ETIMEDOUT", "ENOTFOUND", "EAI_AGAIN"],
};

function getDefaultApiUrl(): string {
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
  public readonly config: {
    apiUrl: string;
    apiKey?: string;
    defaultPageSize: number;
    timeout: number;
    retryConfig: Required<RetryConfig>;
  };

  constructor(config: DataGovRsConfig = {}) {
    const retryConfig: Required<RetryConfig> = {
      maxRetries:
        config.retryConfig?.maxRetries ?? DEFAULT_RETRY_CONFIG.maxRetries,
      initialDelay:
        config.retryConfig?.initialDelay ?? DEFAULT_RETRY_CONFIG.initialDelay,
      maxDelay: config.retryConfig?.maxDelay ?? DEFAULT_RETRY_CONFIG.maxDelay,
      backoffMultiplier:
        config.retryConfig?.backoffMultiplier ??
        DEFAULT_RETRY_CONFIG.backoffMultiplier,
      retryableStatuses: config.retryConfig?.retryableStatuses ?? [
        ...DEFAULT_RETRY_CONFIG.retryableStatuses,
      ],
      retryableErrors: config.retryConfig?.retryableErrors ?? [
        ...DEFAULT_RETRY_CONFIG.retryableErrors,
      ],
    };

    this.config = {
      apiUrl: config.apiUrl || getDefaultApiUrl(),
      apiKey: config.apiKey || process.env.DATA_GOV_RS_API_KEY,
      defaultPageSize: config.defaultPageSize || 20,
      timeout: config.timeout || 10000,
      retryConfig,
    };
  }

  /**
   * Calculate delay with exponential backoff
   */
  private calculateRetryDelay(attempt: number): number {
    const delay = Math.min(
      this.config.retryConfig.initialDelay *
        Math.pow(this.config.retryConfig.backoffMultiplier, attempt),
      this.config.retryConfig.maxDelay
    );
    // Add some jitter to avoid thundering herd
    return delay * (0.5 + Math.random() * 0.5);
  }

  /**
   * Check if an error is retryable
   */
  private isRetryableError(error: ApiError | Error): boolean {
    // Check if it's an ApiError with retryable status
    if ("status" in error) {
      const apiError = error as ApiError;
      if (apiError.isRetryable !== undefined) {
        return apiError.isRetryable;
      }
      return this.config.retryConfig.retryableStatuses.includes(
        apiError.status
      );
    }

    // Check error message for network errors
    const errorMessage = error.message || "";
    return this.config.retryConfig.retryableErrors.some((retryableError) =>
      errorMessage.includes(retryableError)
    );
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Make an API request with retry logic and abortable timeout
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    let lastError: ApiError | Error;
    let attempt = 0;

    while (attempt <= this.config.retryConfig.maxRetries) {
      try {
        return await this.requestWithTimeout<T>(endpoint, options);
      } catch (error) {
        lastError = error as ApiError | Error;
        attempt++;

        // Don't retry if we've exceeded max retries or error is not retryable
        if (
          attempt > this.config.retryConfig.maxRetries ||
          !this.isRetryableError(lastError)
        ) {
          throw lastError;
        }

        // Calculate delay and wait before retry
        const delay = this.calculateRetryDelay(attempt - 1);
        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  /**
   * Make a single API request with abortable timeout
   */
  private async requestWithTimeout<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.apiUrl}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Accept-Language": "sr", // Default to Serbian
      ...(options.headers as Record<string, string>),
    };

    // Add API key if available
    if (this.config.apiKey) {
      headers["X-API-KEY"] = this.config.apiKey;
    }

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      // Clear timeout on successful response
      clearTimeout(timeoutId);

      if (!response.ok) {
        const error: ApiError = {
          message: `API request failed: ${response.statusText}`,
          status: response.status,
        };

        try {
          const errorData = await response.json();
          error.details = errorData;
        } catch {
          // Ignore JSON parse errors for error responses
        }

        throw error;
      }

      return response.json() as Promise<T>;
    } catch (error) {
      // Clear timeout on error
      clearTimeout(timeoutId);

      // Handle AbortError from timeout
      if (error instanceof Error && error.name === "AbortError") {
        const timeoutError: ApiError = {
          message: "Request timeout",
          status: 408,
          isRetryable: true,
        };
        throw timeoutError;
      }

      throw error;
    }
  }

  /**
   * Search datasets
   */
  async searchDatasets(
    params: SearchParams = {}
  ): Promise<PaginatedResponse<DatasetMetadata>> {
    const queryParts: [string, string | number][] = [];

    if (params.q) queryParts.push(["q", params.q]);
    if (!params.q && params.organization)
      queryParts.push(["organization", params.organization]);

    if (params.page) {
      queryParts.push(["page", params.page]);
    }
    queryParts.push([
      "page_size",
      params.page_size ?? this.config.defaultPageSize,
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

    return this.request<PaginatedResponse<DatasetMetadata>>(endpoint);
  }

  /**
   * Get a specific dataset by ID
   */
  async getDataset(id: string): Promise<DatasetMetadata> {
    return this.request<DatasetMetadata>(`/datasets/${id}/`);
  }

  /**
   * List all organizations
   */
  async listOrganizations(
    page: number = 1,
    pageSize: number = this.config.defaultPageSize
  ): Promise<PaginatedResponse<Organization>> {
    return this.request<PaginatedResponse<Organization>>(
      `/organizations/?page=${page}&page_size=${pageSize}`
    );
  }

  /**
   * Search organizations (alias for listOrganizations for test compatibility)
   */
  async searchOrganizations(
    params: SearchParams = {}
  ): Promise<PaginatedResponse<Organization>> {
    return this.listOrganizations(
      params.page || 1,
      params.page_size || this.config.defaultPageSize
    );
  }

  /**
   * Get a specific organization by ID
   */
  async getOrganization(id: string): Promise<Organization> {
    return this.request<Organization>(`/organizations/${id}/`);
  }

  /**
   * Get datasets for a specific organization
   */
  async getOrganizationDatasets(
    organizationId: string,
    page: number = 1,
    pageSize: number = this.config.defaultPageSize
  ): Promise<PaginatedResponse<DatasetMetadata>> {
    return this.searchDatasets({
      organization: organizationId,
      page,
      page_size: pageSize,
    });
  }

  /**
   * Get a specific resource by ID
   */
  async getResource(id: string): Promise<Resource> {
    return this.request<Resource>(`/resources/${id}/`);
  }

  /**
   * Download resource data
   */
  async downloadResource(url: string): Promise<Response> {
    return fetch(url);
  }

  /**
   * Get resource data as text
   */
  async getResourceData(resource: Resource): Promise<string> {
    const response = await this.downloadResource(resource.url);
    return response.text();
  }

  /**
   * Get resource data as JSON
   */
  async getResourceJSON<T = any>(resource: Resource): Promise<T> {
    const response = await this.downloadResource(resource.url);
    return response.json();
  }

  /**
   * Get resource data as ArrayBuffer
   */
  async getResourceArrayBuffer(resource: Resource): Promise<ArrayBuffer> {
    const response = await this.downloadResource(resource.url);
    return response.arrayBuffer();
  }

  /**
   * Get all pages of a paginated response
   */
  async *getAllPages<T>(
    firstPage: PaginatedResponse<T>,
    fetcher: (page: number) => Promise<PaginatedResponse<T>>
  ): AsyncGenerator<T[], void, unknown> {
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
export function createDataGovRsClient(
  config?: Partial<DataGovRsConfig>
): DataGovRsClient {
  return new DataGovRsClient({
    apiUrl:
      config?.apiUrl ||
      process.env.DATA_GOV_RS_API_URL ||
      "https://data.gov.rs/api/1",
    apiKey: config?.apiKey || process.env.DATA_GOV_RS_API_KEY,
    defaultPageSize: config?.defaultPageSize || 20,
    timeout: config?.timeout || 10000,
    retryConfig: config?.retryConfig,
  });
}

/**
 * Default client instance
 */
export const dataGovRsClient = createDataGovRsClient();

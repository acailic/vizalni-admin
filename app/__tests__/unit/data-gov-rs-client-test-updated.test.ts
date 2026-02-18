import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  afterAll,
} from "vitest";

import {
  DataGovRsClient,
  createDataGovRsClient,
  dataGovRsClient,
} from "../../domain/data-gov-rs/client";

import type {
  DatasetMetadata,
  Organization,
  Resource,
  PaginatedResponse,
  SearchParams,
} from "../../domain/data-gov-rs/types";

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const createAbortError = () => {
  try {
    return new DOMException("Aborted", "AbortError");
  } catch {
    const error = new Error("Aborted");
    (error as { name?: string }).name = "AbortError";
    return error;
  }
};

describe("DataGovRsClient", () => {
  let client: DataGovRsClient;

  beforeEach(() => {
    client = new DataGovRsClient({});
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  describe("constructor", () => {
    it("should initialize with default config", () => {
      const defaultClient = new DataGovRsClient({});
      expect(defaultClient.config.apiUrl).toBe("https://data.gov.rs/api/1");
      expect(defaultClient.config.defaultPageSize).toBe(20);
      expect(defaultClient.config.timeout).toBe(10000);
      expect(defaultClient.config.retryConfig.maxRetries).toBe(3);
      expect(defaultClient.config.retryConfig.initialDelay).toBe(1000);
      expect(defaultClient.config.retryConfig.maxDelay).toBe(10000);
      expect(defaultClient.config.retryConfig.backoffMultiplier).toBe(2);
    });

    it("should override config with provided values", () => {
      const customClient = new DataGovRsClient({
        apiUrl: "https://custom.api.com",
        defaultPageSize: 50,
        timeout: 5000,
        retryConfig: {
          maxRetries: 5,
          initialDelay: 500,
          maxDelay: 5000,
        },
      });
      expect(customClient.config.apiUrl).toBe("https://custom.api.com");
      expect(customClient.config.defaultPageSize).toBe(50);
      expect(customClient.config.timeout).toBe(5000);
      expect(customClient.config.retryConfig.maxRetries).toBe(5);
      expect(customClient.config.retryConfig.initialDelay).toBe(500);
      expect(customClient.config.retryConfig.maxDelay).toBe(5000);
    });
  });

  describe("searchDatasets", () => {
    const mockPaginatedResponse: PaginatedResponse<DatasetMetadata> = {
      data: [{ id: "1", title: "Test Dataset" } as DatasetMetadata],
      page: 1,
      page_size: 20,
      total: 1,
    };

    it("should construct URL correctly with no params", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPaginatedResponse),
      });

      await client.searchDatasets();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://data.gov.rs/api/1/datasets/?page_size=20",
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Accept: "application/json",
            "Accept-Language": "sr",
          }),
        })
      );
    });

    it("should encode query parameters correctly", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPaginatedResponse),
      });

      const params: SearchParams = {
        q: "test query with spaces & special chars",
        page: 2,
        page_size: 10,
        organization: "test-org",
        tag: "test-tag",
        sort: "title",
        order: "asc",
      };

      await client.searchDatasets(params);

      const expectedUrl =
        "https://data.gov.rs/api/1/datasets/?q=test%20query%20with%20spaces%20%26%20special%20chars&page=2&page_size=10&organization=test-org&tag=test-tag&sort=title&order=asc";
      expect(mockFetch).toHaveBeenCalledWith(expectedUrl, expect.any(Object));
    });

    it("should parse response correctly", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPaginatedResponse),
      });

      const result = await client.searchDatasets();
      expect(result).toEqual(mockPaginatedResponse);
    });
  });

  describe("getDataset", () => {
    const mockDataset: DatasetMetadata = {
      id: "1",
      title: "Test Dataset",
    } as DatasetMetadata;

    it("should construct URL correctly", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockDataset),
      });

      await client.getDataset("1");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://data.gov.rs/api/1/datasets/1/",
        expect.any(Object)
      );
    });

    it("should parse response correctly", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockDataset),
      });

      const result = await client.getDataset("1");
      expect(result).toEqual(mockDataset);
    });
  });

  describe("listOrganizations", () => {
    const mockPaginatedResponse: PaginatedResponse<Organization> = {
      data: [{ id: "1", title: "Test Org" } as Organization],
      page: 1,
      page_size: 20,
      total: 1,
    };

    it("should construct URL correctly", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPaginatedResponse),
      });

      await client.listOrganizations(2, 10);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://data.gov.rs/api/1/organizations/?page=2&page_size=10",
        expect.any(Object)
      );
    });

    it("should use default page size when not provided", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPaginatedResponse),
      });

      await client.listOrganizations();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://data.gov.rs/api/1/organizations/?page=1&page_size=20",
        expect.any(Object)
      );
    });
  });

  describe("getOrganization", () => {
    const mockOrg: Organization = {
      id: "1",
      title: "Test Org",
    } as Organization;

    it("should construct URL correctly", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockOrg),
      });

      await client.getOrganization("1");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://data.gov.rs/api/1/organizations/1/",
        expect.any(Object)
      );
    });
  });

  describe("getOrganizationDatasets", () => {
    it("should delegate to searchDatasets with organization filter", async () => {
      const mockResponse: PaginatedResponse<DatasetMetadata> = {
        data: [],
        page: 1,
        page_size: 20,
        total: 0,
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await client.getOrganizationDatasets("org-id", 2, 10);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://data.gov.rs/api/1/datasets/?organization=org-id&page=2&page_size=10",
        expect.any(Object)
      );
    });
  });

  describe("getResource", () => {
    const mockResource: Resource = {
      id: "1",
      url: "https://example.com/data.csv",
    } as Resource;

    it("should construct URL correctly", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResource),
      });

      await client.getResource("1");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://data.gov.rs/api/1/resources/1/",
        expect.any(Object)
      );
    });
  });

  describe("downloadResource", () => {
    it("should call fetch with the provided URL", async () => {
      const mockResponse = { ok: true };
      mockFetch.mockResolvedValue(mockResponse);

      const url = "https://example.com/data.csv";
      const result = await client.downloadResource(url);

      expect(mockFetch).toHaveBeenCalledWith(url);
      expect(result).toBe(mockResponse);
    });
  });

  describe("getResourceData", () => {
    it("should return text data", async () => {
      const mockText = "col1,col2\nval1,val2";
      const mockResponse = {
        text: () => Promise.resolve(mockText),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const resource: Resource = {
        id: "1",
        url: "https://example.com/data.csv",
      } as Resource;
      const result = await client.getResourceData(resource);

      expect(result).toBe(mockText);
    });
  });

  describe("getResourceJSON", () => {
    it("should parse JSON data", async () => {
      const mockJson = { key: "value" };
      const mockResponse = {
        json: () => Promise.resolve(mockJson),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const resource: Resource = {
        id: "1",
        url: "https://example.com/data.json",
      } as Resource;
      const result = await client.getResourceJSON(resource);

      expect(result).toEqual(mockJson);
    });
  });

  describe("getResourceArrayBuffer", () => {
    it("should return ArrayBuffer", async () => {
      const mockBuffer = new ArrayBuffer(8);
      const mockResponse = {
        arrayBuffer: () => Promise.resolve(mockBuffer),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const resource: Resource = {
        id: "1",
        url: "https://example.com/data.bin",
      } as Resource;
      const result = await client.getResourceArrayBuffer(resource);

      expect(result).toBe(mockBuffer);
    });
  });

  describe("getAllPages", () => {
    it("should yield all pages", async () => {
      const firstPage: PaginatedResponse<string> = {
        data: ["item1"],
        page: 1,
        page_size: 1,
        total: 3,
      };

      const secondPage: PaginatedResponse<string> = {
        data: ["item2"],
        page: 2,
        page_size: 1,
        total: 3,
      };

      const thirdPage: PaginatedResponse<string> = {
        data: ["item3"],
        page: 3,
        page_size: 1,
        total: 3,
      };

      let callCount = 0;
      mockFetch.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(firstPage),
          });
        } else if (callCount === 2) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(secondPage),
          });
        } else {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(thirdPage),
          });
        }
      });

      const fetcher = vi.fn().mockImplementation(async (page: number) => {
        if (page === 2) return secondPage;
        if (page === 3) return thirdPage;
        throw new Error("Unexpected page");
      });

      const pages: string[][] = [];
      for await (const page of client.getAllPages(firstPage, fetcher)) {
        pages.push(page);
      }

      expect(pages).toEqual([["item1"], ["item2"], ["item3"]]);
      expect(fetcher).toHaveBeenCalledTimes(2);
    });
  });

  describe("error handling", () => {
    it("should throw ApiError on non-ok response", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: () => Promise.resolve({ error: "Dataset not found" }),
      });

      await expect(client.getDataset("invalid")).rejects.toMatchObject({
        message: "API request failed: Not Found",
        status: 404,
        details: { error: "Dataset not found" },
      });
    });

    it("should handle JSON parse error in error response", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: () => Promise.reject(new Error("Invalid JSON")),
      });

      // Create a client with no retries to avoid timeout
      const noRetryClient = new DataGovRsClient({
        retryConfig: { maxRetries: 0 },
      });

      await expect(noRetryClient.getDataset("invalid")).rejects.toMatchObject({
        message: "API request failed: Internal Server Error",
        status: 500,
      });
    });
  });

  describe("timeout behavior", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should throw timeout error when request exceeds timeout", async () => {
      mockFetch.mockImplementation((_url: string, options: RequestInit) => {
        const signal = options.signal as AbortSignal | undefined;
        return new Promise((_resolve, reject) => {
          const onAbort = () => reject(createAbortError());
          if (signal) {
            if (signal.aborted) {
              onAbort();
              return;
            }
            signal.addEventListener("abort", onAbort, { once: true });
          }
        });
      });

      const fastClient = new DataGovRsClient({ timeout: 100 });
      const pending = fastClient.searchDatasets();

      await vi.runAllTimersAsync();

      await expect(pending).rejects.toMatchObject({
        message: "Request timeout",
        status: 408,
        isRetryable: true,
      });
    });

    it("should use AbortController to abort request on timeout", async () => {
      let capturedSignal: AbortSignal | null = null;
      mockFetch.mockImplementation((_url: string, options: RequestInit) => {
        capturedSignal = (options.signal as AbortSignal) || null;
        return new Promise((_resolve, reject) => {
          const onAbort = () => reject(createAbortError());
          if (capturedSignal) {
            if (capturedSignal.aborted) {
              onAbort();
              return;
            }
            capturedSignal.addEventListener("abort", onAbort, { once: true });
          }
        });
      });

      const fastClient = new DataGovRsClient({ timeout: 100 });
      const pending = fastClient.searchDatasets();

      await vi.runAllTimersAsync();

      await expect(pending).rejects.toMatchObject({
        message: "Request timeout",
        status: 408,
      });

      expect(capturedSignal).not.toBeNull();
      expect(capturedSignal!.aborted).toBe(true);
    });

    it("should complete request successfully within timeout", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({ data: [], page: 1, page_size: 20, total: 0 }),
      });

      const fastClient = new DataGovRsClient({ timeout: 100 });
      const result = await fastClient.searchDatasets();

      expect(result).toEqual({ data: [], page: 1, page_size: 20, total: 0 });
    });
  });

  describe("retry behavior", () => {
    let randomSpy: ReturnType<typeof vi.spyOn> | null = null;

    beforeEach(() => {
      vi.useFakeTimers();
      randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.5);
    });

    afterEach(() => {
      randomSpy?.mockRestore();
      vi.useRealTimers();
    });

    it("should retry on timeout error", async () => {
      let attemptCount = 0;
      mockFetch.mockImplementation((_url: string, options: RequestInit) => {
        attemptCount++;
        if (attemptCount < 3) {
          const signal = options.signal as AbortSignal | undefined;
          return new Promise((_resolve, reject) => {
            const onAbort = () => reject(createAbortError());
            if (signal) {
              if (signal.aborted) {
                onAbort();
                return;
              }
              signal.addEventListener("abort", onAbort, { once: true });
            }
          });
        }

        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({ data: [], page: 1, page_size: 20, total: 0 }),
        });
      });

      const fastClient = new DataGovRsClient({
        timeout: 100,
        retryConfig: { maxRetries: 3, initialDelay: 10 },
      });

      const pending = fastClient.searchDatasets();

      await vi.runAllTimersAsync();

      await expect(pending).resolves.toEqual({
        data: [],
        page: 1,
        page_size: 20,
        total: 0,
      });
      expect(attemptCount).toBe(3);
    });

    it("should retry on 500 error", async () => {
      let attemptCount = 0;
      mockFetch.mockImplementation(() => {
        attemptCount++;
        if (attemptCount < 2) {
          return Promise.resolve({
            ok: false,
            status: 500,
            statusText: "Internal Server Error",
            json: () => Promise.resolve({ error: "Server error" }),
          });
        } else {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({ data: [], page: 1, page_size: 20, total: 0 }),
          });
        }
      });

      const pending = client.searchDatasets();
      await vi.runAllTimersAsync();
      await pending;

      expect(attemptCount).toBe(2);
    }, 10000);

    it("should retry on 503 error", async () => {
      let attemptCount = 0;
      mockFetch.mockImplementation(() => {
        attemptCount++;
        if (attemptCount < 2) {
          return Promise.resolve({
            ok: false,
            status: 503,
            statusText: "Service Unavailable",
            json: () => Promise.resolve({ error: "Service unavailable" }),
          });
        } else {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({ data: [], page: 1, page_size: 20, total: 0 }),
          });
        }
      });

      const pending = client.searchDatasets();
      await vi.runAllTimersAsync();
      await pending;

      expect(attemptCount).toBe(2);
    }, 10000);

    it("should retry on 429 rate limit error", async () => {
      let attemptCount = 0;
      mockFetch.mockImplementation(() => {
        attemptCount++;
        if (attemptCount < 2) {
          return Promise.resolve({
            ok: false,
            status: 429,
            statusText: "Too Many Requests",
            json: () => Promise.resolve({ error: "Rate limit exceeded" }),
          });
        } else {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({ data: [], page: 1, page_size: 20, total: 0 }),
          });
        }
      });

      const pending = client.searchDatasets();
      await vi.runAllTimersAsync();
      await pending;

      expect(attemptCount).toBe(2);
    }, 10000);

    it("should not retry on 404 error", async () => {
      let attemptCount = 0;
      mockFetch.mockImplementation(() => {
        attemptCount++;
        return Promise.resolve({
          ok: false,
          status: 404,
          statusText: "Not Found",
          json: () => Promise.resolve({ error: "Not found" }),
        });
      });

      const pending = client.getDataset("invalid");
      await vi.runAllTimersAsync();
      await expect(pending).rejects.toMatchObject({
        message: "API request failed: Not Found",
        status: 404,
      });

      expect(attemptCount).toBe(1);
    });

    it("should not retry on 400 error", async () => {
      let attemptCount = 0;
      mockFetch.mockImplementation(() => {
        attemptCount++;
        return Promise.resolve({
          ok: false,
          status: 400,
          statusText: "Bad Request",
          json: () => Promise.resolve({ error: "Bad request" }),
        });
      });

      const pending = client.searchDatasets();
      await vi.runAllTimersAsync();
      await expect(pending).rejects.toMatchObject({
        message: "API request failed: Bad Request",
        status: 400,
      });

      expect(attemptCount).toBe(1);
    });

    it("should stop retrying after max retries", async () => {
      let attemptCount = 0;
      mockFetch.mockImplementation(() => {
        attemptCount++;
        return Promise.resolve({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
          json: () => Promise.resolve({ error: "Server error" }),
        });
      });

      const clientWithMaxRetries = new DataGovRsClient({
        retryConfig: { maxRetries: 2, initialDelay: 10 },
      });

      const pending = clientWithMaxRetries.searchDatasets();
      await vi.runAllTimersAsync();
      await expect(pending).rejects.toMatchObject({
        message: "API request failed: Internal Server Error",
        status: 500,
      });

      expect(attemptCount).toBe(3); // Initial attempt + 2 retries
    }, 10000);

    it("should use exponential backoff between retries", async () => {
      let attemptCount = 0;
      const sleepSpy = vi.spyOn(
        client as unknown as { sleep: (ms: number) => Promise<void> },
        "sleep"
      );

      mockFetch.mockImplementation(() => {
        attemptCount++;
        if (attemptCount < 4) {
          return Promise.resolve({
            ok: false,
            status: 500,
            statusText: "Internal Server Error",
            json: () => Promise.resolve({ error: "Server error" }),
          });
        } else {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({ data: [], page: 1, page_size: 20, total: 0 }),
          });
        }
      });

      const pending = client.searchDatasets();
      await vi.runAllTimersAsync();
      await pending;

      const delays = sleepSpy.mock.calls.map(([delay]) => delay);
      expect(delays).toEqual([750, 1500, 3000]);
      expect(attemptCount).toBe(4);
    }, 15000);

    it("should respect custom retry config", async () => {
      let attemptCount = 0;
      mockFetch.mockImplementation(() => {
        attemptCount++;
        if (attemptCount < 2) {
          return Promise.resolve({
            ok: false,
            status: 500,
            statusText: "Internal Server Error",
            json: () => Promise.resolve({ error: "Server error" }),
          });
        } else {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({ data: [], page: 1, page_size: 20, total: 0 }),
          });
        }
      });

      const customClient = new DataGovRsClient({
        retryConfig: {
          maxRetries: 5,
          initialDelay: 100,
          maxDelay: 1000,
          backoffMultiplier: 3,
        },
      });

      const pending = customClient.searchDatasets();
      await vi.runAllTimersAsync();
      await pending;

      expect(attemptCount).toBe(2);
      expect(customClient.config.retryConfig.maxRetries).toBe(5);
      expect(customClient.config.retryConfig.initialDelay).toBe(100);
      expect(customClient.config.retryConfig.maxDelay).toBe(1000);
      expect(customClient.config.retryConfig.backoffMultiplier).toBe(3);
    }, 10000);
  });

  describe("createDataGovRsClient", () => {
    it("should create client with default config", () => {
      const client = createDataGovRsClient();
      expect(client).toBeInstanceOf(DataGovRsClient);
      expect(client.config.apiUrl).toBe("https://data.gov.rs/api/1");
    });

    it("should create client with custom config", () => {
      const client = createDataGovRsClient({ apiUrl: "https://custom.com" });
      expect(client.config.apiUrl).toBe("https://custom.com");
    });
  });

  describe("default client instance", () => {
    it("should be an instance of DataGovRsClient", () => {
      expect(dataGovRsClient).toBeInstanceOf(DataGovRsClient);
    });
  });
});

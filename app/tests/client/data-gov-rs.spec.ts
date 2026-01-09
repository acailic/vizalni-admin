/**
 * Comprehensive tests for DataGovRs client
 *
 * Tests the API client for the Serbian Open Data Portal using MSW for API mocking.
 * See: https://data.gov.rs/apidoc/
 */

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { describe, expect, it, beforeAll, afterAll, afterEach } from "vitest";

import {
  DataGovRsClient,
  createDataGovRsClient,
} from "../../domain/data-gov-rs/client";

import type {
  DatasetMetadata,
  Organization,
  Resource,
  PaginatedResponse,
} from "../../domain/data-gov-rs/types";

// Mock data for testing
const mockOrganization: Organization = {
  id: " RepublikaSrbija",
  name: "Republika Srbija",
  title: "Republika Srbija",
  description: "Vlada Republike Srbije",
  image_url: "https://data.gov.rs/static/organization/republika-srbija.png",
  created_at: "2021-01-01T00:00:00.000000",
};

const mockResource: Resource = {
  id: "resource-1",
  title: "CSV Resource",
  description: "Dataset in CSV format",
  format: "CSV",
  url: "https://data.gov.rs/datasets/test-dataset/resource-1.csv",
  created_at: "2023-01-01T00:00:00.000000",
  updated_at: "2023-01-01T00:00:00.000000",
  filesize: 1024,
  mimetype: "text/csv",
};

const mockDataset: DatasetMetadata = {
  id: "test-dataset-1",
  title: "Test Dataset 1",
  description: "Test dataset for unit testing",
  organization: mockOrganization,
  resources: [mockResource],
  tags: ["test", "sample", "data"],
  created_at: "2023-01-01T00:00:00.000000",
  updated_at: "2023-01-01T00:00:00.000000",
  slug: "test-dataset-1",
  page: "https://data.gov.rs/datasets/test-dataset-1",
  frequency: "monthly",
  spatial: "Srbija",
  temporal_start: "2020-01-01",
  temporal_end: "2023-12-31",
  license: "CC-BY-4.0",
  license_url: "https://creativecommons.org/licenses/by/4.0/",
};

const mockDatasets: DatasetMetadata[] = [
  mockDataset,
  {
    ...mockDataset,
    id: "test-dataset-2",
    title: "Test Dataset 2",
    description: "Another test dataset",
  },
  {
    ...mockDataset,
    id: "test-dataset-3",
    title: "Test Dataset 3",
    description: "Yet another test dataset",
  },
];

const mockOrganizations: Organization[] = [
  mockOrganization,
  {
    ...mockOrganization,
    id: "ministarstvo-zdravlja",
    name: "Ministarstvo zdravlja",
    title: "Ministarstvo zdravlja",
  },
  {
    ...mockOrganization,
    id: "ministarstvo-prosvete",
    name: "Ministarstvo prosvete",
    title: "Ministarstvo prosvete",
  },
];

// MSW server setup
const API_BASE_URL = "https://data.gov.rs/api/1";

const server = setupServer(
  // Dataset search endpoints
  http.get(`${API_BASE_URL}/datasets/`, ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const organization = url.searchParams.get("organization");
    const tag = url.searchParams.get("tag");
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("page_size") || "20");

    // Filter datasets based on query params
    let filteredDatasets = mockDatasets;

    if (q) {
      const query = q.toLowerCase();
      filteredDatasets = filteredDatasets.filter(
        (d) =>
          d.title.toLowerCase().includes(query) ||
          d.description.toLowerCase().includes(query)
      );
    }

    if (organization) {
      filteredDatasets = filteredDatasets.filter(
        (d) => d.organization.id === organization
      );
    }

    if (tag) {
      filteredDatasets = filteredDatasets.filter((d) => d.tags.includes(tag));
    }

    // Pagination
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = filteredDatasets.slice(start, end);

    const response: PaginatedResponse<DatasetMetadata> = {
      data: paginatedData,
      page,
      page_size: pageSize,
      total: filteredDatasets.length,
      next_page: end < filteredDatasets.length ? page + 1 : undefined,
      previous_page: page > 1 ? page - 1 : undefined,
    };

    return HttpResponse.json(response);
  }),

  // Get dataset by ID
  http.get(`${API_BASE_URL}/datasets/:id/`, ({ params }) => {
    const { id } = params;

    if (id === "nonexistent") {
      return HttpResponse.json(
        { message: "Dataset not found" },
        { status: 404 }
      );
    }

    const dataset = mockDatasets.find((d) => d.id === id);
    if (!dataset) {
      return HttpResponse.json(
        { message: "Dataset not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json(dataset);
  }),

  // List organizations
  http.get(`${API_BASE_URL}/organizations/`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("page_size") || "20");

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = mockOrganizations.slice(start, end);

    const response: PaginatedResponse<Organization> = {
      data: paginatedData,
      page,
      page_size: pageSize,
      total: mockOrganizations.length,
      next_page: end < mockOrganizations.length ? page + 1 : undefined,
      previous_page: page > 1 ? page - 1 : undefined,
    };

    return HttpResponse.json(response);
  }),

  // Get organization by ID
  http.get(`${API_BASE_URL}/organizations/:id/`, ({ params }) => {
    const { id } = params;

    if (id === "nonexistent") {
      return HttpResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    const organization = mockOrganizations.find((o) => o.id === id);
    if (!organization) {
      return HttpResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json(organization);
  }),

  // Get resource by ID
  http.get(`${API_BASE_URL}/resources/:id/`, ({ params }) => {
    const { id } = params;

    if (id === "nonexistent") {
      return HttpResponse.json(
        { message: "Resource not found" },
        { status: 404 }
      );
    }

    if (id === mockResource.id) {
      return HttpResponse.json(mockResource);
    }

    return HttpResponse.json(
      { message: "Resource not found" },
      { status: 404 }
    );
  }),

  // Download resource (actual CSV data)
  http.get("https://data.gov.rs/datasets/test-dataset/resource-1.csv", () => {
    return HttpResponse.text("id,name,value\n1,Test,100\n2,Sample,200");
  })
);

describe("DataGovRsClient", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  describe("createDataGovRsClient()", () => {
    it("should create client with default config", () => {
      const client = createDataGovRsClient();

      expect(client).toBeInstanceOf(DataGovRsClient);
      expect(client.config.apiUrl).toBe("https://data.gov.rs/api/1");
      expect(client.config.defaultPageSize).toBe(20);
      expect(client.config.timeout).toBe(10000);
    });

    it("should create client with custom config", () => {
      const customConfig = {
        apiUrl: "https://custom-api.example.com",
        apiKey: "test-api-key",
        defaultPageSize: 50,
        timeout: 30000,
      };

      const client = createDataGovRsClient(customConfig);

      expect(client.config.apiUrl).toBe(customConfig.apiUrl);
      expect(client.config.apiKey).toBe(customConfig.apiKey);
      expect(client.config.defaultPageSize).toBe(customConfig.defaultPageSize);
      expect(client.config.timeout).toBe(customConfig.timeout);
    });

    it("should create client with partial custom config", () => {
      const client = createDataGovRsClient({
        defaultPageSize: 10,
      });

      expect(client.config.defaultPageSize).toBe(10);
      expect(client.config.timeout).toBe(10000); // Default value
    });

    it("should create client with DataGovRsClient constructor", () => {
      const client = new DataGovRsClient({
        apiUrl: "https://test-api.example.com",
      });

      expect(client.config.apiUrl).toBe("https://test-api.example.com");
    });
  });

  describe("searchDatasets()", () => {
    it("should search datasets with query string", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      const result = await client.searchDatasets({ q: "Test Dataset" });

      expect(result.data).toHaveLength(3);
      expect(result.data[0].title).toContain("Test");
      expect(result.page).toBe(1);
      expect(result.page_size).toBe(20);
      expect(result.total).toBe(3);
    });

    it("should search datasets with organization filter", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      const result = await client.searchDatasets({
        organization: " RepublikaSrbija",
      });

      expect(result.data).toHaveLength(3);
      expect(result.data[0].organization.id).toBe(" RepublikaSrbija");
    });

    it("should search datasets with tag filter", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      const result = await client.searchDatasets({ tag: "test" });

      expect(result.data).toHaveLength(3);
      expect(result.data[0].tags).toContain("test");
    });

    it("should handle pagination correctly", async () => {
      const client = new DataGovRsClient({
        apiUrl: API_BASE_URL,
        defaultPageSize: 2,
      });

      const page1 = await client.searchDatasets({ page: 1, page_size: 2 });
      expect(page1.data).toHaveLength(2);
      expect(page1.page).toBe(1);
      expect(page1.next_page).toBe(2);

      const page2 = await client.searchDatasets({ page: 2, page_size: 2 });
      expect(page2.data).toHaveLength(1);
      expect(page2.page).toBe(2);
      expect(page2.previous_page).toBe(1);
    });

    it("should return empty results for non-matching query", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      const result = await client.searchDatasets({ q: "nonexistent" });

      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it("should use default page size from config", async () => {
      const client = new DataGovRsClient({
        apiUrl: API_BASE_URL,
        defaultPageSize: 10,
      });

      const result = await client.searchDatasets();

      expect(result.page_size).toBe(10);
    });

    it("should override default page size with explicit parameter", async () => {
      const client = new DataGovRsClient({
        apiUrl: API_BASE_URL,
        defaultPageSize: 10,
      });

      const result = await client.searchDatasets({ page_size: 5 });

      expect(result.page_size).toBe(5);
    });

    it("should handle combined search parameters", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      const result = await client.searchDatasets({
        q: "Dataset",
        organization: " RepublikaSrbija",
        tag: "test",
        page: 1,
        page_size: 10,
      });

      expect(result.data.length).toBeGreaterThan(0);
      expect(result.page).toBe(1);
      expect(result.page_size).toBe(10);
    });
  });

  describe("getDataset()", () => {
    it("should fetch dataset by ID", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      const dataset = await client.getDataset("test-dataset-1");

      expect(dataset).toBeDefined();
      expect(dataset.id).toBe("test-dataset-1");
      expect(dataset.title).toBe("Test Dataset 1");
      expect(dataset.organization).toBeDefined();
      expect(dataset.resources).toHaveLength(1);
    });

    it("should throw error for nonexistent dataset", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      await expect(client.getDataset("nonexistent")).rejects.toThrow();
    });

    it("should throw error with status 404 for nonexistent dataset", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      try {
        await client.getDataset("nonexistent");
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.status).toBe(404);
        expect(error.message).toBeDefined();
      }
    });

    it("should fetch dataset with all metadata fields", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      const dataset = await client.getDataset("test-dataset-1");

      expect(dataset.id).toBeDefined();
      expect(dataset.title).toBeDefined();
      expect(dataset.description).toBeDefined();
      expect(dataset.organization).toBeDefined();
      expect(dataset.resources).toBeDefined();
      expect(dataset.tags).toBeDefined();
      expect(dataset.created_at).toBeDefined();
      expect(dataset.updated_at).toBeDefined();
      expect(dataset.slug).toBeDefined();
      expect(dataset.page).toBeDefined();
      expect(dataset.frequency).toBeDefined();
      expect(dataset.spatial).toBeDefined();
      expect(dataset.license).toBeDefined();
    });
  });

  describe("listOrganizations()", () => {
    it("should list all organizations with default pagination", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      const result = await client.listOrganizations();

      expect(result.data).toHaveLength(3);
      expect(result.page).toBe(1);
      expect(result.page_size).toBe(20);
      expect(result.total).toBe(3);
    });

    it("should handle pagination parameters", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      const result = await client.listOrganizations(1, 2);

      expect(result.data).toHaveLength(2);
      expect(result.page).toBe(1);
      expect(result.page_size).toBe(2);
    });

    it("should return organizations with correct structure", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      const result = await client.listOrganizations();

      expect(result.data[0]).toHaveProperty("id");
      expect(result.data[0]).toHaveProperty("name");
      expect(result.data[0]).toHaveProperty("title");
      expect(result.data[0]).toHaveProperty("description");
      expect(result.data[0]).toHaveProperty("image_url");
    });
  });

  describe("searchOrganizations()", () => {
    it("should search organizations (alias for listOrganizations)", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      const result = await client.searchOrganizations({
        page: 1,
        page_size: 10,
      });

      expect(result.data).toHaveLength(3);
      expect(result.page).toBe(1);
      expect(result.page_size).toBe(10);
    });

    it("should use default page size when not specified", async () => {
      const client = new DataGovRsClient({
        apiUrl: API_BASE_URL,
        defaultPageSize: 15,
      });

      const result = await client.searchOrganizations();

      expect(result.page_size).toBe(15);
    });

    it("should accept search parameters object", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      const result = await client.searchOrganizations({
        page: 2,
        page_size: 5,
      });

      expect(result.page).toBe(2);
      expect(result.page_size).toBe(5);
    });

    it("should handle empty search params", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      const result = await client.searchOrganizations({});

      expect(result.data).toHaveLength(3);
      expect(result.page).toBe(1);
    });
  });

  describe("getOrganization()", () => {
    it("should fetch organization by ID", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      const organization = await client.getOrganization(" RepublikaSrbija");

      expect(organization).toBeDefined();
      expect(organization.id).toBe(" RepublikaSrbija");
      expect(organization.name).toBe("Republika Srbija");
      expect(organization.title).toBe("Republika Srbija");
    });

    it("should throw error for nonexistent organization", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      await expect(client.getOrganization("nonexistent")).rejects.toThrow();
    });

    it("should throw error with status 404 for nonexistent organization", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      try {
        await client.getOrganization("nonexistent");
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.status).toBe(404);
        expect(error.message).toBeDefined();
      }
    });
  });

  describe("getOrganizationDatasets()", () => {
    it("should fetch datasets for specific organization", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      const result = await client.getOrganizationDatasets(" RepublikaSrbija");

      expect(result.data).toHaveLength(3);
      expect(result.data[0].organization.id).toBe(" RepublikaSrbija");
    });

    it("should support pagination for organization datasets", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      const result = await client.getOrganizationDatasets(
        " RepublikaSrbija",
        1,
        2
      );

      expect(result.data).toHaveLength(2);
      expect(result.page).toBe(1);
      expect(result.page_size).toBe(2);
    });

    it("should use default page size from config", async () => {
      const client = new DataGovRsClient({
        apiUrl: API_BASE_URL,
        defaultPageSize: 5,
      });

      const result = await client.getOrganizationDatasets(" RepublikaSrbija");

      expect(result.page_size).toBe(5);
    });
  });

  describe("getResource()", () => {
    it("should fetch resource by ID", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      const resource = await client.getResource("resource-1");

      expect(resource).toBeDefined();
      expect(resource.id).toBe("resource-1");
      expect(resource.title).toBe("CSV Resource");
      expect(resource.format).toBe("CSV");
      expect(resource.url).toBeDefined();
    });

    it("should throw error for nonexistent resource", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      await expect(client.getResource("nonexistent")).rejects.toThrow();
    });

    it("should throw error with status 404 for nonexistent resource", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      try {
        await client.getResource("nonexistent");
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.status).toBe(404);
        expect(error.message).toBeDefined();
      }
    });

    it("should fetch resource with all metadata fields", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      const resource = await client.getResource("resource-1");

      expect(resource.id).toBeDefined();
      expect(resource.title).toBeDefined();
      expect(resource.description).toBeDefined();
      expect(resource.format).toBeDefined();
      expect(resource.url).toBeDefined();
      expect(resource.created_at).toBeDefined();
      expect(resource.updated_at).toBeDefined();
      expect(resource.filesize).toBeDefined();
      expect(resource.mimetype).toBeDefined();
    });
  });

  describe("downloadResource()", () => {
    it("should download resource data", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      const response = await client.downloadResource(
        "https://data.gov.rs/datasets/test-dataset/resource-1.csv"
      );

      expect(response.ok).toBe(true);
      const text = await response.text();
      expect(text).toContain("id,name,value");
    });

    it("should handle download errors", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      // Mock a failed download
      server.use(
        http.get("https://data.gov.rs/datasets/missing/resource.csv", () => {
          return HttpResponse.json(
            { message: "Resource not found" },
            { status: 404 }
          );
        })
      );

      const response = await client.downloadResource(
        "https://data.gov.rs/datasets/missing/resource.csv"
      );

      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
    });
  });

  describe("getResourceData()", () => {
    it("should get resource data as text", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      const text = await client.getResourceData(mockResource);

      expect(text).toBe("id,name,value\n1,Test,100\n2,Sample,200");
    });

    it("should handle download errors gracefully", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      const invalidResource: Resource = {
        ...mockResource,
        url: "https://data.gov.rs/datasets/missing/resource.csv",
      };

      // Mock the error response
      server.use(
        http.get("https://data.gov.rs/datasets/missing/resource.csv", () => {
          return HttpResponse.json(
            { message: "Resource not found" },
            { status: 404 }
          );
        })
      );

      // getResourceData internally calls downloadResource which returns a Response
      // It then calls .text() on the response, which will fail for 404
      const text = await client.getResourceData(invalidResource);
      // For 404, we should get an error response body
      expect(text).toContain("Resource not found");
    });
  });

  describe("getAllPages()", () => {
    it("should fetch all pages of paginated response", async () => {
      const client = new DataGovRsClient({
        apiUrl: API_BASE_URL,
        defaultPageSize: 2,
      });

      const firstPage = await client.searchDatasets({ page_size: 2 });
      const allDatasets: DatasetMetadata[] = [];

      for await (const page of client.getAllPages(firstPage, (pageNum) =>
        client.searchDatasets({ page: pageNum, page_size: 2 })
      )) {
        allDatasets.push(...page);
      }

      expect(allDatasets).toHaveLength(3);
    });

    it("should handle single page response", async () => {
      const client = new DataGovRsClient({
        apiUrl: API_BASE_URL,
        defaultPageSize: 20,
      });

      const firstPage = await client.searchDatasets();
      const allDatasets: DatasetMetadata[] = [];

      for await (const page of client.getAllPages(firstPage, (pageNum) =>
        client.searchDatasets({ page: pageNum })
      )) {
        allDatasets.push(...page);
      }

      expect(allDatasets).toHaveLength(3);
    });
  });
});

describe("DataGovRsClient - Error Handling", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  describe("Network errors", () => {
    it("should handle network timeout", async () => {
      const client = new DataGovRsClient({
        apiUrl: API_BASE_URL,
        timeout: 100,
      });

      // Mock a delayed response
      server.use(
        http.get(`${API_BASE_URL}/datasets/`, () => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(HttpResponse.json({ data: [], total: 0 }));
            }, 200);
          });
        })
      );

      await expect(client.searchDatasets()).rejects.toMatchObject({
        status: 408,
        message: "Request timeout",
      });
    });

    it("should handle network failures", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      // Mock network failure
      server.use(
        http.get(`${API_BASE_URL}/datasets/`, () => {
          return HttpResponse.error();
        })
      );

      await expect(client.searchDatasets()).rejects.toThrow();
    });
  });

  describe("API errors", () => {
    it("should handle 404 Not Found errors", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      server.use(
        http.get(`${API_BASE_URL}/datasets/:id/`, () => {
          return HttpResponse.json(
            { message: "Dataset not found" },
            { status: 404 }
          );
        })
      );

      try {
        await client.getDataset("nonexistent");
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.status).toBe(404);
        expect(error.message).toContain("API request failed");
      }
    });

    it("should handle 500 Internal Server Error", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      server.use(
        http.get(`${API_BASE_URL}/datasets/`, () => {
          return HttpResponse.json(
            { message: "Internal server error" },
            { status: 500 }
          );
        })
      );

      try {
        await client.searchDatasets();
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.status).toBe(500);
      }
    });

    it("should handle 401 Unauthorized errors", async () => {
      const client = new DataGovRsClient({
        apiUrl: API_BASE_URL,
        apiKey: "invalid-key",
      });

      server.use(
        http.get(`${API_BASE_URL}/datasets/`, () => {
          return HttpResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
          );
        })
      );

      try {
        await client.searchDatasets();
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.status).toBe(401);
      }
    });

    it("should handle 429 Rate Limit errors", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      server.use(
        http.get(`${API_BASE_URL}/datasets/`, () => {
          return HttpResponse.json(
            { message: "Rate limit exceeded" },
            { status: 429 }
          );
        })
      );

      try {
        await client.searchDatasets();
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.status).toBe(429);
      }
    });

    it("should include error details when available", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      const errorDetails = {
        error: "Validation Error",
        details: {
          field: "q",
          message: "Invalid query parameter",
        },
      };

      server.use(
        http.get(`${API_BASE_URL}/datasets/`, () => {
          return HttpResponse.json(errorDetails, { status: 400 });
        })
      );

      try {
        await client.searchDatasets();
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.status).toBe(400);
        expect(error.details).toEqual(errorDetails);
      }
    });

    it("should handle malformed error responses", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      server.use(
        http.get(`${API_BASE_URL}/datasets/`, () => {
          return HttpResponse.json(null, { status: 500 });
        })
      );

      try {
        await client.searchDatasets();
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.status).toBe(500);
        expect(error.message).toBeDefined();
      }
    });

    it("should handle non-JSON error responses", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      server.use(
        http.get(`${API_BASE_URL}/datasets/`, () => {
          return HttpResponse.text("Internal Server Error", { status: 500 });
        })
      );

      try {
        await client.searchDatasets();
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.status).toBe(500);
        expect(error.message).toBeDefined();
        expect(error.details).toBeUndefined();
      }
    });
  });

  describe("Timeout handling", () => {
    it("should timeout after configured duration", async () => {
      const client = new DataGovRsClient({
        apiUrl: API_BASE_URL,
        timeout: 50,
      });

      server.use(
        http.get(`${API_BASE_URL}/datasets/`, () => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(HttpResponse.json({ data: [], total: 0 }));
            }, 100);
          });
        })
      );

      const startTime = Date.now();
      await expect(client.searchDatasets()).rejects.toMatchObject({
        status: 408,
        message: "Request timeout",
      });
      const duration = Date.now() - startTime;

      // Should timeout close to configured time (with some margin)
      expect(duration).toBeGreaterThanOrEqual(40);
      expect(duration).toBeLessThan(200);
    });

    it("should complete request before timeout", async () => {
      const client = new DataGovRsClient({
        apiUrl: API_BASE_URL,
        timeout: 1000,
      });

      server.use(
        http.get(`${API_BASE_URL}/datasets/`, () => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(HttpResponse.json({ data: [], total: 0 }));
            }, 100);
          });
        })
      );

      const result = await client.searchDatasets();
      expect(result).toBeDefined();
    });
  });

  describe("Request headers", () => {
    it("should include default headers", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      let capturedHeaders: Headers | null = null;

      server.use(
        http.get(`${API_BASE_URL}/datasets/`, ({ request }) => {
          capturedHeaders = request.headers;
          return HttpResponse.json({ data: [], total: 0 });
        })
      );

      await client.searchDatasets();

      expect(capturedHeaders).not.toBeNull();
      expect(capturedHeaders!.get("Content-Type")).toBe("application/json");
      expect(capturedHeaders!.get("Accept")).toBe("application/json");
      expect(capturedHeaders!.get("Accept-Language")).toBe("sr");
    });

    it("should include API key when configured", async () => {
      const client = new DataGovRsClient({
        apiUrl: API_BASE_URL,
        apiKey: "test-api-key-12345",
      });

      let capturedHeaders: Headers | null = null;

      server.use(
        http.get(`${API_BASE_URL}/datasets/`, ({ request }) => {
          capturedHeaders = request.headers;
          return HttpResponse.json({ data: [], total: 0 });
        })
      );

      await client.searchDatasets();

      expect(capturedHeaders!.get("X-API-KEY")).toBe("test-api-key-12345");
    });

    it("should not include API key when not configured", async () => {
      const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

      let capturedHeaders: Headers | null = null;

      server.use(
        http.get(`${API_BASE_URL}/datasets/`, ({ request }) => {
          capturedHeaders = request.headers;
          return HttpResponse.json({ data: [], total: 0 });
        })
      );

      await client.searchDatasets();

      expect(capturedHeaders!.get("X-API-KEY")).toBeNull();
    });
  });
});

describe("DataGovRsClient - Edge Cases", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("should handle empty dataset list", async () => {
    const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

    server.use(
      http.get(`${API_BASE_URL}/datasets/`, () => {
        return HttpResponse.json({ data: [], total: 0 });
      })
    );

    const result = await client.searchDatasets();

    expect(result.data).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it("should handle dataset with no resources", async () => {
    const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

    const datasetNoResources: DatasetMetadata = {
      ...mockDataset,
      id: "no-resources",
      resources: [],
    };

    server.use(
      http.get(`${API_BASE_URL}/datasets/no-resources/`, () => {
        return HttpResponse.json(datasetNoResources);
      })
    );

    const dataset = await client.getDataset("no-resources");

    expect(dataset.resources).toHaveLength(0);
  });

  it("should handle dataset with no tags", async () => {
    const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

    const datasetNoTags: DatasetMetadata = {
      ...mockDataset,
      id: "no-tags",
      tags: [],
    };

    server.use(
      http.get(`${API_BASE_URL}/datasets/no-tags/`, () => {
        return HttpResponse.json(datasetNoTags);
      })
    );

    const dataset = await client.getDataset("no-tags");

    expect(dataset.tags).toHaveLength(0);
  });

  it("should handle organization with minimal data", async () => {
    const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

    const minimalOrganization: Organization = {
      id: "minimal-org",
      name: "Minimal Organization",
    };

    server.use(
      http.get(`${API_BASE_URL}/organizations/minimal-org/`, () => {
        return HttpResponse.json(minimalOrganization);
      })
    );

    const organization = await client.getOrganization("minimal-org");

    expect(organization.id).toBe("minimal-org");
    expect(organization.name).toBe("Minimal Organization");
    expect(organization.description).toBeUndefined();
    expect(organization.image_url).toBeUndefined();
  });

  it("should handle resource with minimal data", async () => {
    const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

    const minimalResource: Resource = {
      id: "minimal-resource",
      title: "Minimal Resource",
      format: "JSON",
      url: "https://example.com/data.json",
      created_at: "2023-01-01T00:00:00.000000",
    };

    server.use(
      http.get(`${API_BASE_URL}/resources/minimal-resource/`, () => {
        return HttpResponse.json(minimalResource);
      })
    );

    const resource = await client.getResource("minimal-resource");

    expect(resource.id).toBe("minimal-resource");
    expect(resource.description).toBeUndefined();
    expect(resource.filesize).toBeUndefined();
    expect(resource.mimetype).toBeUndefined();
  });

  it("should handle special characters in search query", async () => {
    const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

    // Mock response for special characters
    server.use(
      http.get(`${API_BASE_URL}/datasets/`, ({ request }) => {
        const url = new URL(request.url);
        const q = url.searchParams.get("q");

        // Should properly encode special characters
        expect(q).toBeTruthy();

        return HttpResponse.json({ data: [], total: 0 });
      })
    );

    await client.searchDatasets({ q: "test & data" });
  });

  it("should handle very large page size", async () => {
    const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

    const result = await client.searchDatasets({ page_size: 1000 });

    expect(result.page_size).toBe(1000);
  });

  it("should handle page number 0", async () => {
    const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

    // API should handle page 0 or convert it to page 1
    const result = await client.searchDatasets({ page: 0 });

    expect(result).toBeDefined();
  });

  it("should handle negative page size", async () => {
    const client = new DataGovRsClient({ apiUrl: API_BASE_URL });

    // API should handle invalid page size
    const result = await client.searchDatasets({ page_size: -1 });

    expect(result).toBeDefined();
  });
});

/**
 * API Service Layer for data.gov.rs
 *
 * Provides high-level functions for fetching data from the Serbian Government Open Data Portal
 */

import { dataGovRsClient, API_ENDPOINTS } from './config';
import type { PaginatedResponse, Dataset, Organization } from '@/types/api';

/**
 * Dataset API Service
 */
export const DatasetService = {
  /**
   * Get all datasets with pagination
   */
  async getAll(page = 1, pageSize = 20): Promise<PaginatedResponse<Dataset>> {
    const response = await dataGovRsClient.get<PaginatedResponse<Dataset>>(
      API_ENDPOINTS.DATASETS,
      { params: { page, page_size: pageSize } }
    );
    return response.data;
  },

  /**
   * Get a single dataset by ID or slug
   */
  async getById(id: string): Promise<Dataset> {
    const response = await dataGovRsClient.get<Dataset>(API_ENDPOINTS.DATASET(id));
    return response.data;
  },

  /**
   * Search datasets
   */
  async search(query: string, page = 1, pageSize = 20): Promise<PaginatedResponse<Dataset>> {
    const response = await dataGovRsClient.get<PaginatedResponse<Dataset>>(
      API_ENDPOINTS.DATASETS,
      { params: { q: query, page, page_size: pageSize } }
    );
    return response.data;
  },

  /**
   * Get featured datasets for homepage
   */
  async getFeatured(): Promise<Dataset[]> {
    const response = await dataGovRsClient.get<Dataset[]>(API_ENDPOINTS.SITE_HOME_DATASETS);
    return response.data;
  },

  /**
   * Get dataset suggestions for autocomplete
   */
  async suggest(query: string, size = 10): Promise<Dataset[]> {
    const response = await dataGovRsClient.get<{ suggestions: Dataset[] }>(
      API_ENDPOINTS.DATASET_SUGGEST,
      { params: { q: query, size } }
    );
    return response.data.suggestions || [];
  },

  /**
   * Get datasets by organization
   */
  async getByOrganization(orgId: string, page = 1, pageSize = 20): Promise<PaginatedResponse<Dataset>> {
    const response = await dataGovRsClient.get<PaginatedResponse<Dataset>>(
      API_ENDPOINTS.ORGANIZATION_DATASETS(orgId),
      { params: { page, page_size: pageSize } }
    );
    return response.data;
  },

  /**
   * Get dataset resources
   */
  async getResources(datasetId: string): Promise<Dataset['resources']> {
    const dataset = await this.getById(datasetId);
    return dataset.resources;
  },
};

/**
 * Organization API Service
 */
export const OrganizationService = {
  /**
   * Get all organizations with pagination
   */
  async getAll(page = 1, pageSize = 20): Promise<PaginatedResponse<Organization>> {
    const response = await dataGovRsClient.get<PaginatedResponse<Organization>>(
      API_ENDPOINTS.ORGANIZATIONS,
      { params: { page, page_size: pageSize } }
    );
    return response.data;
  },

  /**
   * Get a single organization by ID or slug
   */
  async getById(id: string): Promise<Organization> {
    const response = await dataGovRsClient.get<Organization>(API_ENDPOINTS.ORGANIZATION(id));
    return response.data;
  },

  /**
   * Search organizations
   */
  async search(query: string, page = 1, pageSize = 20): Promise<PaginatedResponse<Organization>> {
    const response = await dataGovRsClient.get<PaginatedResponse<Organization>>(
      API_ENDPOINTS.ORGANIZATIONS,
      { params: { q: query, page, page_size: pageSize } }
    );
    return response.data;
  },
};

/**
 * Reuse API Service (Examples of data usage)
 */
export const ReuseService = {
  /**
   * Get all reuses with pagination
   */
  async getAll(page = 1, pageSize = 20): Promise<PaginatedResponse<unknown>> {
    const response = await dataGovRsClient.get<PaginatedResponse<unknown>>(
      API_ENDPOINTS.REUSES,
      { params: { page, page_size: pageSize } }
    );
    return response.data;
  },

  /**
   * Get featured reuses for homepage
   */
  async getFeatured(): Promise<unknown[]> {
    const response = await dataGovRsClient.get<unknown[]>(API_ENDPOINTS.SITE_HOME_REUSES);
    return response.data;
  },
};

/**
 * Spatial API Service (Geographic data)
 */
export const SpatialService = {
  /**
   * Get zone by ID
   */
  async getZone(id: string): Promise<unknown> {
    const response = await dataGovRsClient.get(API_ENDPOINTS.SPATIAL_ZONE(id));
    return response.data;
  },

  /**
   * Suggest zones for autocomplete
   */
  async suggestZones(query: string, size = 10): Promise<unknown[]> {
    const response = await dataGovRsClient.get(API_ENDPOINTS.SPATIAL_SUGGEST, {
      params: { q: query, size },
    });
    return response.data;
  },
};

/**
 * Tags API Service
 */
export const TagsService = {
  /**
   * Suggest tags for autocomplete
   */
  async suggest(query: string, size = 10): Promise<string[]> {
    const response = await dataGovRsClient.get(API_ENDPOINTS.TAGS_SUGGEST, {
      params: { q: query, size },
    });
    return response.data;
  },
};

/**
 * Activity API Service (Recent changes)
 */
export const ActivityService = {
  /**
   * Get recent activity
   */
  async getRecent(page = 1, pageSize = 20): Promise<unknown[]> {
    const response = await dataGovRsClient.get(API_ENDPOINTS.ACTIVITY, {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },
};

/**
 * Site API Service (Site information)
 */
export const SiteService = {
  /**
   * Get site information and metrics
   */
  async getInfo(): Promise<unknown> {
    const response = await dataGovRsClient.get(API_ENDPOINTS.SITE);
    return response.data;
  },
};

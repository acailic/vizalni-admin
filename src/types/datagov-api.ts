/**
 * TypeScript types for data.gov.rs API
 * Based on the official API specification: https://data.gov.rs/api/1/swagger.json
 */

// ============================================================================
// Core Types
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  next_page?: string;
  page: number;
  page_size: number;
  previous_page?: string;
  total: number;
}

export interface Reference {
  class: string;
  id: string;
}

// ============================================================================
// Dataset Types
// ============================================================================

export interface Dataset {
  id: string;
  title: string;
  acronym?: string;
  slug: string;
  description: string;
  created_at: string;
  last_modified: string;
  last_update: string;
  deleted?: string;
  archived?: string;
  private?: boolean;
  featured?: boolean;
  tags: string[];
  badges: Badge[];
  resources: Resource[];
  frequency: Frequency;
  frequency_date?: string;
  extras: Record<string, unknown>;
  harvest: HarvestDatasetMetadata;
  metrics: DatasetMetrics;
  organization?: OrganizationReference;
  owner?: UserReference;
  schema?: Schema;
  temporal_coverage?: TemporalCoverage;
  spatial?: SpatialCoverage;
  license: string;
  uri: string;
  page: string;
  quality?: DatasetQuality;
  internal?: DatasetInternals;
  contact_points?: ContactPoint[];
}

export interface DatasetMetrics {
  followers: number;
  views: number;
  reuses: number;
  downloads?: number;
}

export interface DatasetQuality {
  score: number;
  resources_availability: number;
  format_availability: number;
}

export interface DatasetInternals {
  created_at_internal: string;
  last_modified_internal: string;
}

export interface DatasetReference extends Reference {
  title: string;
  acronym?: string;
  page: string;
  uri: string;
}

// ============================================================================
// Resource Types
// ============================================================================

export interface Resource {
  id: string;
  title: string;
  description?: string;
  filetype: 'file' | 'remote';
  format: string;
  url: string;
  type: ResourceType;
  mime?: string;
  filesize?: number;
  created_at: string;
  last_modified: string;
  latest: string;
  metrics?: ResourceMetrics;
  checksum?: Checksum;
  extras?: Record<string, unknown>;
  harvest?: HarvestResourceMetadata;
  internal?: ResourceInternals;
  schema?: Schema;
  preview_url?: string;
}

export type ResourceType = 
  | 'main'
  | 'documentation'
  | 'update'
  | 'api'
  | 'code'
  | 'other';

export interface ResourceMetrics {
  views: number;
  downloads: number;
}

export interface Checksum {
  type: 'sha1' | 'sha2' | 'sha256' | 'md5' | 'crc';
  value: string;
}

export interface ResourceInternals {
  created_at_internal: string;
  last_modified_internal: string;
}

// ============================================================================
// Organization Types
// ============================================================================

export interface Organization {
  id: string;
  name: string;
  acronym?: string;
  slug: string;
  description: string;
  url?: string;
  logo?: string;
  logo_thumbnail?: string;
  created_at: string;
  last_modified: string;
  deleted?: string;
  badges: Badge[];
  members?: Member[];
  metrics: OrganizationMetrics;
  extras?: Record<string, unknown>;
  page: string;
  uri: string;
  business_number_id?: string;
}

export interface OrganizationReference extends Reference {
  name: string;
  acronym?: string;
  slug: string;
  logo?: string;
  logo_thumbnail?: string;
  badges: Badge[];
  page: string;
  uri: string;
}

export interface OrganizationMetrics {
  datasets: number;
  followers: number;
  views: number;
  reuses: number;
}

export interface Member {
  role: 'admin' | 'editor';
  since: string;
  user: UserReference;
}

// ============================================================================
// User Types
// ============================================================================

export interface User {
  id: string;
  slug: string;
  first_name: string;
  last_name: string;
  about?: string;
  avatar?: string;
  avatar_thumbnail?: string;
  website?: string;
  since: string;
  active: boolean;
  email?: string;
  last_login_at?: string;
  metrics: UserMetrics;
  organizations: OrganizationReference[];
  page: string;
  uri: string;
  roles?: string[];
}

export interface UserReference extends Reference {
  slug: string;
  uri: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  avatar_thumbnail?: string;
  page: string;
}

export interface UserMetrics {
  datasets: number;
  reuses: number;
  followers: number;
  views: number;
}

// ============================================================================
// Reuse Types
// ============================================================================

export interface Reuse {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: ReuseType;
  topic: ReuseTopic;
  url: string;
  image?: string;
  image_thumbnail?: string;
  created_at: string;
  last_modified: string;
  deleted?: string;
  archived?: string;
  featured: boolean;
  tags: string[];
  badges: Badge[];
  datasets: Dataset[];
  metrics: ReuseMetrics;
  organization?: OrganizationReference;
  owner?: UserReference;
  page: string;
  uri: string;
  private?: boolean;
  extras?: Record<string, unknown>;
}

export type ReuseType =
  | 'api'
  | 'application'
  | 'idea'
  | 'news_article'
  | 'paper'
  | 'post'
  | 'visualization'
  | 'hardware';

export type ReuseTopic =
  | 'health'
  | 'transport_and_mobility'
  | 'housing_and_development'
  | 'food_and_agriculture'
  | 'culture_and_recreation'
  | 'economy_and_business'
  | 'environment_and_energy'
  | 'work_and_training'
  | 'politics_and_public_life'
  | 'safety_and_security'
  | 'education_and_research'
  | 'society_and_demography'
  | 'law_and_justice'
  | 'open_data_tools'
  | 'others';

export interface ReuseMetrics {
  followers: number;
  views: number;
  datasets: number;
}

// ============================================================================
// Badge Types
// ============================================================================

export interface Badge {
  kind: string;
}

// ============================================================================
// Schema Types
// ============================================================================

export interface Schema {
  name: string;
  url: string;
  version?: string;
}

// ============================================================================
// Temporal Coverage
// ============================================================================

export interface TemporalCoverage {
  start: string;
  end?: string;
}

// ============================================================================
// Spatial Coverage
// ============================================================================

export interface SpatialCoverage {
  zones?: string[];
  granularity?: string;
  geom?: GeoJSON;
}

export interface GeoJSON {
  type: 'Point' | 'LineString' | 'Polygon' | 'MultiPoint' | 'MultiLineString' | 'MultiPolygon';
  coordinates: unknown[];
}

// ============================================================================
// Harvest Types
// ============================================================================

export interface HarvestDatasetMetadata {
  backend?: string;
  created_at?: string;
  modified_at?: string;
  source_id?: string;
  remote_id?: string;
  remote_url?: string;
  uri?: string;
  domain?: string;
  last_update?: string;
  archived?: string;
  archived_at?: string;
  ckan_name?: string;
  ckan_source?: string;
  dct_identifier?: string;
}

export interface HarvestResourceMetadata {
  created_at?: string;
  modified_at?: string;
  uri?: string;
}

// ============================================================================
// Frequency Types
// ============================================================================

export type Frequency =
  | 'unknown'
  | 'punctual'
  | 'continuous'
  | 'hourly'
  | 'fourTimesADay'
  | 'threeTimesADay'
  | 'semidaily'
  | 'daily'
  | 'fourTimesAWeek'
  | 'threeTimesAWeek'
  | 'semiweekly'
  | 'weekly'
  | 'biweekly'
  | 'threeTimesAMonth'
  | 'semimonthly'
  | 'monthly'
  | 'bimonthly'
  | 'quarterly'
  | 'threeTimesAYear'
  | 'semiannual'
  | 'annual'
  | 'biennial'
  | 'triennial'
  | 'quadrennial'
  | 'quinquennial'
  | 'decennial'
  | 'irregular';

// ============================================================================
// Contact Point Types
// ============================================================================

export interface ContactPoint {
  id: string;
  name: string;
  email: string;
  contact_form?: string;
  role: string;
  organization?: OrganizationReference;
  owner?: UserReference;
}

// ============================================================================
// Discussion Types
// ============================================================================

export interface Discussion {
  id: string;
  class: string;
  title: string;
  created: string;
  closed?: string;
  closed_by?: UserReference;
  subject: Reference;
  user: UserReference;
  discussion: DiscussionMessage;
  url: string;
  extras?: Record<string, unknown>;
  spam?: Spam;
}

export interface DiscussionMessage {
  content: string;
  posted_by: UserReference;
  posted_on: string;
  spam?: Spam;
}

export interface Spam {
  status: 'not_checked' | 'potential_spam' | 'no_spam';
}

// ============================================================================
// Topic Types
// ============================================================================

export interface Topic {
  id: string;
  name: string;
  slug: string;
  description: string;
  tags: string[];
  created_at: string;
  last_modified: string;
  datasets: Dataset[];
  reuses: Reuse[];
  featured: boolean;
  private: boolean;
  page: string;
  uri: string;
  extras?: Record<string, unknown>;
  organization?: OrganizationReference;
  owner?: UserReference;
  spatial?: SpatialCoverage;
}

// ============================================================================
// Dataservice Types
// ============================================================================

export interface Dataservice {
  id: string;
  title: string;
  acronym?: string;
  slug: string;
  description?: string;
  base_api_url?: string;
  format?: 'REST' | 'WMS' | 'WSL';
  access_type?: 'open' | 'open_with_account' | 'restricted';
  license?: string;
  tags: string[];
  created_at: string;
  metadata_modified_at: string;
  deleted_at?: string;
  archived_at?: string;
  contact_points?: ContactPoint[];
  datasets?: Dataset[];
  organization?: OrganizationReference;
  owner?: UserReference;
  private?: boolean;
  metrics?: Record<string, unknown>;
  self_api_url: string;
  self_web_url: string;
  machine_documentation_url?: string;
  technical_documentation_url?: string;
  business_documentation_url?: string;
  rate_limiting?: string;
  rate_limiting_url?: string;
  availability?: number;
  availability_url?: string;
  authorization_request_url?: string;
  extras?: Record<string, unknown>;
  harvest?: HarvestMetadata;
}

export interface HarvestMetadata {
  id: string;
  backend?: string;
  domain?: string;
  created_at?: string;
  last_update?: string;
  remote_id?: string;
  remote_url?: string;
  source_id?: string;
  source_url?: string;
  archived_at?: string;
  archived_reason?: string;
  uri?: string;
}

// ============================================================================
// Community Resource Types
// ============================================================================

export interface CommunityResource extends Resource {
  dataset: DatasetReference;
  organization?: OrganizationReference;
  owner?: UserReference;
}

// ============================================================================
// API Query Parameters
// ============================================================================

export interface DatasetQueryParams {
  q?: string;
  tag?: string[];
  license?: string;
  featured?: boolean;
  geozone?: string;
  granularity?: string;
  temporal_coverage?: string;
  organization?: string;
  organization_badge?: string;
  owner?: string;
  format?: string;
  schema?: string;
  schema_version?: string;
  topic?: string;
  credit?: string;
  dataservice?: string;
  sort?: string;
  page?: number;
  page_size?: number;
}

// License type
export interface License {
  id: string;
  title: string;
  slug: string;
  url?: string;
  maintenance?: string;
  flags?: string[];
}

export interface OrganizationQueryParams {
  q?: string;
  badge?: string;
  sort?: string;
  page?: number;
  page_size?: number;
}

export interface ReuseQueryParams {
  q?: string;
  dataset?: string;
  tag?: string;
  organization?: string;
  organization_badge?: string;
  owner?: string;
  type?: string;
  topic?: string;
  featured?: boolean;
  sort?: string;
  page?: number;
  page_size?: number;
}

// ============================================================================
// API Response Types
// ============================================================================

export type DatasetPage = PaginatedResponse<Dataset>;
export type OrganizationPage = PaginatedResponse<Organization>;
export type ReusePage = PaginatedResponse<Reuse>;
export type DataservicePage = PaginatedResponse<Dataservice>;
export type CommunityResourcePage = PaginatedResponse<CommunityResource>;
export type TopicPage = PaginatedResponse<Topic>;
export type DiscussionPage = PaginatedResponse<Discussion>;

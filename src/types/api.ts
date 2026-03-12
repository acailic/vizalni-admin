/**
 * Type definitions for data.gov.rs API
 */

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  page_size?: number;
  pageSize?: number; // Alias for camelCase
  total: number;
  totalPages?: number;
  next_page?: string;
  previous_page?: string;
}

// Alias for backward compatibility
export type ApiResponse<T> = PaginatedResponse<T>

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
  private: boolean;
  tags: string[];
  badges: Badge[];
  resources: Resource[];
  frequency: Frequency;
  frequency_date?: string;
  extras: Record<string, unknown>;
  harvest?: HarvestMetadata;
  metrics?: Record<string, number>;
  organization?: OrganizationReference;
  owner?: UserReference;
  schema?: Schema;
  temporal_coverage?: TemporalCoverage;
  spatial?: SpatialCoverage;
  license: string;
  uri: string;
  page: string;
  quality?: QualityMetrics;
  internal?: DatasetInternals;
  contact_points?: ContactPoint[];
}

export interface Resource {
  id: string;
  title: string;
  description?: string;
  filetype: 'file' | 'remote';
  format: string;
  url: string;
  filesize?: number;
  mime?: string;
  checksum?: Checksum;
  created_at: string;
  last_modified: string;
  latest: string;
  metrics?: Record<string, number>;
  type: ResourceType;
  extras: Record<string, unknown>;
  harvest?: HarvestResourceMetadata;
  internal?: ResourceInternals;
  preview_url?: string;
  schema?: Schema;
}

export interface Organization {
  id: string;
  name: string;
  acronym?: string;
  slug: string;
  description: string;
  logo?: string;
  logo_thumbnail?: string;
  created_at: string;
  last_modified: string;
  deleted?: string;
  badges: Badge[];
  members?: Member[];
  metrics?: Record<string, number>;
  extras: Record<string, unknown>;
  page?: string;
  uri?: string;
  url?: string;
  business_number_id?: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  slug: string;
  email?: string;
  avatar?: string;
  avatar_thumbnail?: string;
  about?: string;
  website?: string;
  since: string;
  last_login_at?: string;
  organizations?: OrganizationReference[];
  metrics?: Record<string, number>;
  page?: string;
  uri?: string;
  active: boolean;
  roles?: string[];
}

export interface Reuse {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: ReuseType;
  topic: ReuseTopic;
  url: string;
  created_at: string;
  last_modified: string;
  deleted?: string;
  archived?: string;
  private: boolean;
  tags: string[];
  badges: Badge[];
  datasets: Dataset[];
  organization?: OrganizationReference;
  owner?: UserReference;
  image?: string;
  image_thumbnail?: string;
  metrics?: Record<string, number>;
  extras: Record<string, unknown>;
  page: string;
  uri: string;
  featured: boolean;
}

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
  organization?: OrganizationReference;
  owner?: UserReference;
  featured: boolean;
}

/**
 * Post/News from data.gov.rs
 */
export interface Post {
  id: string;
  name: string;
  slug: string;
  headline: string;
  content: string;
  image?: string;
  credits?: string;
  tags: string[];
  created_at: string;
  last_modified: string;
  published_at?: string;
  uri: string;
  page: string;
  extras?: Record<string, unknown>;
}

export interface Discussion {
  id: string;
  class: string;
  title: string;
  created: string;
  closed?: string;
  closed_by?: UserReference;
  subject: ModelReference;
  user: UserReference;
  discussion: DiscussionMessage;
  url?: string;
  extras?: Record<string, unknown>;
  spam?: SpamStatus;
}

export interface DiscussionMessage {
  content: string;
  posted_by: UserReference;
  posted_on: string;
  spam?: SpamStatus;
}

export interface Badge {
  kind: string;
}

export interface ContactPoint {
  id: string;
  name: string;
  email: string;
  contact_form?: string;
  role: string;
  organization?: OrganizationReference;
  owner?: UserReference;
}

export interface Member {
  role: 'admin' | 'editor';
  since: string;
  user: UserReference;
}

export interface Schema {
  name: string;
  url?: string;
  version?: string;
}

export interface Checksum {
  type: 'sha1' | 'sha2' | 'sha256' | 'md5' | 'crc';
  value: string;
}

export interface SpatialCoverage {
  geom?: GeoJSON;
  granularity?: string;
  zones?: string[];
}

export interface TemporalCoverage {
  start: string;
  end?: string;
}

export interface GeoJSON {
  type: 'Point' | 'LineString' | 'Polygon' | 'MultiPoint' | 'MultiLineString' | 'MultiPolygon';
  coordinates: number[] | number[][] | number[][][];
}

export interface QualityMetrics {
  dataset_size?: number;
  resources_count?: number;
  harvest_score?: number;
  has_resources?: boolean;
  has_description?: boolean;
  has_tags?: boolean;
  has_license?: boolean;
  has_spatial?: boolean;
  has_temporal?: boolean;
  score?: number;
}

export interface HarvestMetadata {
  backend?: string;
  source_id?: string;
  domain?: string;
  remote_id?: string;
  remote_url?: string;
  uri?: string;
  created_at?: string;
  modified_at?: string;
  last_update?: string;
  archived?: string;
  archived_at?: string;
}

export interface HarvestResourceMetadata {
  uri?: string;
  created_at?: string;
  modified_at?: string;
}

export interface DatasetInternals {
  created_at_internal: string;
  last_modified_internal: string;
}

export interface ResourceInternals {
  created_at_internal: string;
  last_modified_internal: string;
}

export interface SpamStatus {
  status: 'not_checked' | 'potential_spam' | 'no_spam';
}

// Reference types
export interface BaseReference {
  class: string;
  id: string;
}

export interface OrganizationReference extends BaseReference {
  name: string;
  acronym?: string;
  slug: string;
  logo?: string;
  logo_thumbnail?: string;
  badges: Badge[];
  page?: string;
  uri?: string;
}

export interface UserReference extends BaseReference {
  first_name: string;
  last_name: string;
  slug: string;
  avatar?: string;
  avatar_thumbnail?: string;
  page?: string;
  uri?: string;
}

export interface DatasetReference extends BaseReference {
  title: string;
  acronym?: string;
  page?: string;
  uri?: string;
}

export interface ModelReference {
  class: string;
  id: string;
}

// Enums
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

export type ResourceType = 'main' | 'documentation' | 'update' | 'api' | 'code' | 'other';

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

// API Query Parameters
export interface DatasetQueryParams {
  q?: string;
  sort?:
    | 'title'
    | 'created'
    | 'last_update'
    | 'reuses'
    | 'followers'
    | 'views'
    | '-title'
    | '-created'
    | '-last_update'
    | '-reuses'
    | '-followers'
    | '-views';
  page?: number;
  page_size?: number;
  tag?: string[];
  license?: string;
  featured?: boolean;
  geozone?: string;
  granularity?: string;
  temporal_coverage?: string;
  organization?: string;
  organization_badge?: 'public-service' | 'certified' | 'association' | 'company' | 'local-authority';
  owner?: string;
  format?: string;
  schema?: string;
  schema_version?: string;
  topic?: string;
  credit?: string;
  dataservice?: string;
}

// Alias for backward compatibility
export interface SearchParams {
  page?: number;
  pageSize?: number;
  query?: string;
  sort?: string;
  organization?: string;
  topic?: string;
  tag?: string;
  license?: string[];
  format?: string[];
  temporal?: string;
  spatial?: string;
  frequency?: string;
}

export interface OrganizationQueryParams {
  q?: string;
  sort?:
    | 'name'
    | 'reuses'
    | 'datasets'
    | 'followers'
    | 'views'
    | 'created'
    | 'last_modified'
    | '-name'
    | '-reuses'
    | '-datasets'
    | '-followers'
    | '-views'
    | '-created'
    | '-last_modified';
  page?: number;
  page_size?: number;
  badge?: 'public-service' | 'certified' | 'association' | 'company' | 'local-authority';
}

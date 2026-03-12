/**
 * DataGovRs Client Exports for @acailic/vizualni-admin/client
 *
 * Exports the Serbian Open Data Portal API client and related types.
 */

export {
  DataGovRsClient,
  createDataGovRsClient,
  dataGovRsClient,
} from "../domain/data-gov-rs/client";
export type {
  DatasetMetadata,
  Organization,
  Resource,
  PaginatedResponse,
  SearchParams,
  DataGovRsConfig,
  ApiError,
} from "../domain/data-gov-rs/types";

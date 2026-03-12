import { ComponentTermsets } from '../domain/data';
import { DataCubeComponents } from '../domain/data';
import { DataCubeMetadata } from '../domain/data';
import { DataCubeObservations } from '../domain/data';
import { DataCubePreview } from '../domain/data';
import { DataSourceUrl } from '../domain/data-source';
import { DimensionValue } from '../domain/data';
import { Filters } from '../configurator';
import { GeoShapes } from '../domain/data';
import { HierarchyValue } from '../domain/data';
import { Observation } from '../domain/data';
import { RawObservation } from '../domain/data';
import { SearchCube } from '../domain/data';
import { SingleFilters } from '../configurator';
import { Termset } from '../domain/data';
import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  ComponentTermsets: { input: ComponentTermsets; output: ComponentTermsets; }
  DataCubeComponents: { input: DataCubeComponents; output: DataCubeComponents; }
  DataCubeMetadata: { input: DataCubeMetadata; output: DataCubeMetadata; }
  DataCubeObservations: { input: DataCubeObservations; output: DataCubeObservations; }
  DataCubePreview: { input: DataCubePreview; output: DataCubePreview; }
  DataSourceUrl: { input: DataSourceUrl; output: DataSourceUrl; }
  DimensionValue: { input: DimensionValue; output: DimensionValue; }
  FilterValue: { input: any; output: any; }
  Filters: { input: Filters; output: Filters; }
  GeoShapes: { input: GeoShapes; output: GeoShapes; }
  HierarchyValue: { input: HierarchyValue; output: HierarchyValue; }
  Observation: { input: Observation; output: Observation; }
  RawObservation: { input: RawObservation; output: RawObservation; }
  SearchCube: { input: SearchCube; output: SearchCube; }
  SingleFilters: { input: SingleFilters; output: SingleFilters; }
  Termset: { input: Termset; output: Termset; }
  ValueIdentifier: { input: any; output: any; }
  ValuePosition: { input: any; output: any; }
};

export type DataCubeComponentFilter = {
  componentIds?: InputMaybe<Array<Scalars['String']['input']>>;
  filters?: InputMaybe<Scalars['Filters']['input']>;
  iri: Scalars['String']['input'];
  joinBy?: InputMaybe<Array<Scalars['String']['input']>>;
  loadValues?: InputMaybe<Scalars['Boolean']['input']>;
};

export type DataCubeDimensionGeoShapesCubeFilter = {
  dimensionId: Scalars['String']['input'];
  iri: Scalars['String']['input'];
};

export type DataCubeLatestIriFilter = {
  iri: Scalars['String']['input'];
};

export type DataCubeMetadataFilter = {
  iri: Scalars['String']['input'];
};

export type DataCubeObservationFilter = {
  componentIds?: InputMaybe<Array<Scalars['String']['input']>>;
  filters?: InputMaybe<Scalars['Filters']['input']>;
  iri: Scalars['String']['input'];
  joinBy?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type DataCubeOrganization = {
  __typename: 'DataCubeOrganization';
  iri: Scalars['String']['output'];
  label?: Maybe<Scalars['String']['output']>;
};

export type DataCubePossibleFiltersCubeFilter = {
  filters: Scalars['SingleFilters']['input'];
  iri: Scalars['String']['input'];
};

export type DataCubePreviewFilter = {
  iri: Scalars['String']['input'];
};

export enum DataCubePublicationStatus {
  Draft = 'DRAFT',
  Published = 'PUBLISHED'
}

export type DataCubeTermset = {
  __typename: 'DataCubeTermset';
  iri: Scalars['String']['output'];
  label?: Maybe<Scalars['String']['output']>;
};

export type DataCubeTermsetFilter = {
  iri: Scalars['String']['input'];
};

export type DataCubeTheme = {
  __typename: 'DataCubeTheme';
  iri: Scalars['String']['output'];
  label?: Maybe<Scalars['String']['output']>;
};

export type DataCubeUnversionedIriFilter = {
  iri: Scalars['String']['input'];
};

export type PossibleFilterValue = {
  __typename: 'PossibleFilterValue';
  id: Scalars['String']['output'];
  type: Scalars['String']['output'];
  value?: Maybe<Scalars['FilterValue']['output']>;
};

export type Query = {
  __typename: 'Query';
  dataCubeComponentTermsets: Array<Scalars['ComponentTermsets']['output']>;
  dataCubeComponents: Scalars['DataCubeComponents']['output'];
  dataCubeDimensionGeoShapes?: Maybe<Scalars['GeoShapes']['output']>;
  dataCubeLatestIri: Scalars['String']['output'];
  dataCubeMetadata: Scalars['DataCubeMetadata']['output'];
  dataCubeObservations: Scalars['DataCubeObservations']['output'];
  dataCubePreview: Scalars['DataCubePreview']['output'];
  dataCubeUnversionedIri?: Maybe<Scalars['String']['output']>;
  possibleFilters: Array<PossibleFilterValue>;
  searchCubes: Array<SearchCubeResult>;
};


export type QueryDataCubeComponentTermsetsArgs = {
  cubeFilter: DataCubeTermsetFilter;
  locale: Scalars['String']['input'];
  sourceType: Scalars['String']['input'];
  sourceUrl: Scalars['DataSourceUrl']['input'];
};


export type QueryDataCubeComponentsArgs = {
  cubeFilter: DataCubeComponentFilter;
  locale: Scalars['String']['input'];
  sourceType: Scalars['String']['input'];
  sourceUrl: Scalars['DataSourceUrl']['input'];
};


export type QueryDataCubeDimensionGeoShapesArgs = {
  cubeFilter: DataCubeDimensionGeoShapesCubeFilter;
  locale: Scalars['String']['input'];
  sourceType: Scalars['String']['input'];
  sourceUrl: Scalars['DataSourceUrl']['input'];
};


export type QueryDataCubeLatestIriArgs = {
  cubeFilter: DataCubeLatestIriFilter;
  sourceType: Scalars['String']['input'];
  sourceUrl: Scalars['DataSourceUrl']['input'];
};


export type QueryDataCubeMetadataArgs = {
  cubeFilter: DataCubeMetadataFilter;
  locale: Scalars['String']['input'];
  sourceType: Scalars['String']['input'];
  sourceUrl: Scalars['DataSourceUrl']['input'];
};


export type QueryDataCubeObservationsArgs = {
  cubeFilter: DataCubeObservationFilter;
  locale: Scalars['String']['input'];
  sourceType: Scalars['String']['input'];
  sourceUrl: Scalars['DataSourceUrl']['input'];
};


export type QueryDataCubePreviewArgs = {
  cubeFilter: DataCubePreviewFilter;
  locale: Scalars['String']['input'];
  sourceType: Scalars['String']['input'];
  sourceUrl: Scalars['DataSourceUrl']['input'];
};


export type QueryDataCubeUnversionedIriArgs = {
  cubeFilter: DataCubeUnversionedIriFilter;
  sourceType: Scalars['String']['input'];
  sourceUrl: Scalars['DataSourceUrl']['input'];
};


export type QueryPossibleFiltersArgs = {
  cubeFilter: DataCubePossibleFiltersCubeFilter;
  sourceType: Scalars['String']['input'];
  sourceUrl: Scalars['DataSourceUrl']['input'];
};


export type QuerySearchCubesArgs = {
  fetchDimensionTermsets?: InputMaybe<Scalars['Boolean']['input']>;
  filters?: InputMaybe<Array<SearchCubeFilter>>;
  includeDrafts?: InputMaybe<Scalars['Boolean']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<SearchCubeResultOrder>;
  query?: InputMaybe<Scalars['String']['input']>;
  sourceType: Scalars['String']['input'];
  sourceUrl: Scalars['DataSourceUrl']['input'];
};

export type RelatedDimension = {
  __typename: 'RelatedDimension';
  id: Scalars['String']['output'];
  type: RelatedDimensionType;
};

export enum RelatedDimensionType {
  ConfidenceLowerBound = 'ConfidenceLowerBound',
  ConfidenceUpperBound = 'ConfidenceUpperBound',
  StandardError = 'StandardError'
}

export enum ScaleType {
  Interval = 'Interval',
  Nominal = 'Nominal',
  Ordinal = 'Ordinal',
  Ratio = 'Ratio'
}

export type SearchCubeFilter = {
  label?: InputMaybe<Scalars['String']['input']>;
  type: SearchCubeFilterType;
  value: Scalars['String']['input'];
};

export enum SearchCubeFilterType {
  DataCubeAbout = 'DataCubeAbout',
  DataCubeOrganization = 'DataCubeOrganization',
  DataCubeTermset = 'DataCubeTermset',
  DataCubeTheme = 'DataCubeTheme',
  TemporalDimension = 'TemporalDimension'
}

export type SearchCubeResult = {
  __typename: 'SearchCubeResult';
  cube: Scalars['SearchCube']['output'];
  highlightedDescription?: Maybe<Scalars['String']['output']>;
  highlightedTitle?: Maybe<Scalars['String']['output']>;
  score?: Maybe<Scalars['Float']['output']>;
};

export enum SearchCubeResultOrder {
  CreatedDesc = 'CREATED_DESC',
  Score = 'SCORE',
  TitleAsc = 'TITLE_ASC'
}

export enum TimeUnit {
  Day = 'Day',
  Hour = 'Hour',
  Minute = 'Minute',
  Month = 'Month',
  Second = 'Second',
  Week = 'Week',
  Year = 'Year'
}

export type SearchCubesQueryVariables = Exact<{
  sourceType: Scalars['String']['input'];
  sourceUrl: Scalars['DataSourceUrl']['input'];
  locale: Scalars['String']['input'];
  query?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<SearchCubeResultOrder>;
  includeDrafts?: InputMaybe<Scalars['Boolean']['input']>;
  fetchDimensionTermsets?: InputMaybe<Scalars['Boolean']['input']>;
  filters?: InputMaybe<Array<SearchCubeFilter> | SearchCubeFilter>;
}>;


export type SearchCubesQuery = { __typename: 'Query', searchCubes: Array<{ __typename: 'SearchCubeResult', highlightedTitle?: string | null, highlightedDescription?: string | null, cube: SearchCube }> };

export type DataCubeLatestIriQueryVariables = Exact<{
  sourceType: Scalars['String']['input'];
  sourceUrl: Scalars['DataSourceUrl']['input'];
  cubeFilter: DataCubeLatestIriFilter;
}>;


export type DataCubeLatestIriQuery = { __typename: 'Query', dataCubeLatestIri: string };

export type DataCubeUnversionedIriQueryVariables = Exact<{
  sourceType: Scalars['String']['input'];
  sourceUrl: Scalars['DataSourceUrl']['input'];
  cubeFilter: DataCubeUnversionedIriFilter;
}>;


export type DataCubeUnversionedIriQuery = { __typename: 'Query', dataCubeUnversionedIri?: string | null };

export type DataCubeComponentsQueryVariables = Exact<{
  sourceType: Scalars['String']['input'];
  sourceUrl: Scalars['DataSourceUrl']['input'];
  locale: Scalars['String']['input'];
  cubeFilter: DataCubeComponentFilter;
}>;


export type DataCubeComponentsQuery = { __typename: 'Query', dataCubeComponents: DataCubeComponents };

export type DataCubeDimensionGeoShapesQueryVariables = Exact<{
  sourceType: Scalars['String']['input'];
  sourceUrl: Scalars['DataSourceUrl']['input'];
  locale: Scalars['String']['input'];
  cubeFilter: DataCubeDimensionGeoShapesCubeFilter;
}>;


export type DataCubeDimensionGeoShapesQuery = { __typename: 'Query', dataCubeDimensionGeoShapes?: GeoShapes | null };

export type DataCubeMetadataQueryVariables = Exact<{
  sourceType: Scalars['String']['input'];
  sourceUrl: Scalars['DataSourceUrl']['input'];
  locale: Scalars['String']['input'];
  cubeFilter: DataCubeMetadataFilter;
}>;


export type DataCubeMetadataQuery = { __typename: 'Query', dataCubeMetadata: DataCubeMetadata };

export type DataCubeComponentTermsetsQueryVariables = Exact<{
  sourceType: Scalars['String']['input'];
  sourceUrl: Scalars['DataSourceUrl']['input'];
  locale: Scalars['String']['input'];
  cubeFilter: DataCubeTermsetFilter;
}>;


export type DataCubeComponentTermsetsQuery = { __typename: 'Query', dataCubeComponentTermsets: Array<ComponentTermsets> };

export type DataCubeObservationsQueryVariables = Exact<{
  sourceType: Scalars['String']['input'];
  sourceUrl: Scalars['DataSourceUrl']['input'];
  locale: Scalars['String']['input'];
  cubeFilter: DataCubeObservationFilter;
}>;


export type DataCubeObservationsQuery = { __typename: 'Query', dataCubeObservations: DataCubeObservations };

export type DataCubePreviewQueryVariables = Exact<{
  sourceType: Scalars['String']['input'];
  sourceUrl: Scalars['DataSourceUrl']['input'];
  locale: Scalars['String']['input'];
  cubeFilter: DataCubePreviewFilter;
}>;


export type DataCubePreviewQuery = { __typename: 'Query', dataCubePreview: DataCubePreview };

export type PossibleFiltersQueryVariables = Exact<{
  sourceType: Scalars['String']['input'];
  sourceUrl: Scalars['DataSourceUrl']['input'];
  cubeFilter: DataCubePossibleFiltersCubeFilter;
}>;


export type PossibleFiltersQuery = { __typename: 'Query', possibleFilters: Array<{ __typename: 'PossibleFilterValue', type: string, id: string, value?: any | null }> };


export const SearchCubesDocument = gql`
    query SearchCubes($sourceType: String!, $sourceUrl: DataSourceUrl!, $locale: String!, $query: String, $order: SearchCubeResultOrder, $includeDrafts: Boolean, $fetchDimensionTermsets: Boolean, $filters: [SearchCubeFilter!]) {
  searchCubes(
    sourceType: $sourceType
    sourceUrl: $sourceUrl
    locale: $locale
    query: $query
    order: $order
    includeDrafts: $includeDrafts
    fetchDimensionTermsets: $fetchDimensionTermsets
    filters: $filters
  ) {
    highlightedTitle
    highlightedDescription
    cube
  }
}
    `;

export function useSearchCubesQuery(options: Omit<Urql.UseQueryArgs<SearchCubesQueryVariables>, 'query'>) {
  return Urql.useQuery<SearchCubesQuery, SearchCubesQueryVariables>({ query: SearchCubesDocument, ...options });
};
export const DataCubeLatestIriDocument = gql`
    query DataCubeLatestIri($sourceType: String!, $sourceUrl: DataSourceUrl!, $cubeFilter: DataCubeLatestIriFilter!) {
  dataCubeLatestIri(
    sourceType: $sourceType
    sourceUrl: $sourceUrl
    cubeFilter: $cubeFilter
  )
}
    `;

export function useDataCubeLatestIriQuery(options: Omit<Urql.UseQueryArgs<DataCubeLatestIriQueryVariables>, 'query'>) {
  return Urql.useQuery<DataCubeLatestIriQuery, DataCubeLatestIriQueryVariables>({ query: DataCubeLatestIriDocument, ...options });
};
export const DataCubeUnversionedIriDocument = gql`
    query DataCubeUnversionedIri($sourceType: String!, $sourceUrl: DataSourceUrl!, $cubeFilter: DataCubeUnversionedIriFilter!) {
  dataCubeUnversionedIri(
    sourceType: $sourceType
    sourceUrl: $sourceUrl
    cubeFilter: $cubeFilter
  )
}
    `;

export function useDataCubeUnversionedIriQuery(options: Omit<Urql.UseQueryArgs<DataCubeUnversionedIriQueryVariables>, 'query'>) {
  return Urql.useQuery<DataCubeUnversionedIriQuery, DataCubeUnversionedIriQueryVariables>({ query: DataCubeUnversionedIriDocument, ...options });
};
export const DataCubeComponentsDocument = gql`
    query DataCubeComponents($sourceType: String!, $sourceUrl: DataSourceUrl!, $locale: String!, $cubeFilter: DataCubeComponentFilter!) {
  dataCubeComponents(
    sourceType: $sourceType
    sourceUrl: $sourceUrl
    locale: $locale
    cubeFilter: $cubeFilter
  )
}
    `;

export function useDataCubeComponentsQuery(options: Omit<Urql.UseQueryArgs<DataCubeComponentsQueryVariables>, 'query'>) {
  return Urql.useQuery<DataCubeComponentsQuery, DataCubeComponentsQueryVariables>({ query: DataCubeComponentsDocument, ...options });
};
export const DataCubeDimensionGeoShapesDocument = gql`
    query DataCubeDimensionGeoShapes($sourceType: String!, $sourceUrl: DataSourceUrl!, $locale: String!, $cubeFilter: DataCubeDimensionGeoShapesCubeFilter!) {
  dataCubeDimensionGeoShapes(
    sourceType: $sourceType
    sourceUrl: $sourceUrl
    locale: $locale
    cubeFilter: $cubeFilter
  )
}
    `;

export function useDataCubeDimensionGeoShapesQuery(options: Omit<Urql.UseQueryArgs<DataCubeDimensionGeoShapesQueryVariables>, 'query'>) {
  return Urql.useQuery<DataCubeDimensionGeoShapesQuery, DataCubeDimensionGeoShapesQueryVariables>({ query: DataCubeDimensionGeoShapesDocument, ...options });
};
export const DataCubeMetadataDocument = gql`
    query DataCubeMetadata($sourceType: String!, $sourceUrl: DataSourceUrl!, $locale: String!, $cubeFilter: DataCubeMetadataFilter!) {
  dataCubeMetadata(
    sourceType: $sourceType
    sourceUrl: $sourceUrl
    locale: $locale
    cubeFilter: $cubeFilter
  )
}
    `;

export function useDataCubeMetadataQuery(options: Omit<Urql.UseQueryArgs<DataCubeMetadataQueryVariables>, 'query'>) {
  return Urql.useQuery<DataCubeMetadataQuery, DataCubeMetadataQueryVariables>({ query: DataCubeMetadataDocument, ...options });
};
export const DataCubeComponentTermsetsDocument = gql`
    query DataCubeComponentTermsets($sourceType: String!, $sourceUrl: DataSourceUrl!, $locale: String!, $cubeFilter: DataCubeTermsetFilter!) {
  dataCubeComponentTermsets(
    sourceType: $sourceType
    sourceUrl: $sourceUrl
    locale: $locale
    cubeFilter: $cubeFilter
  )
}
    `;

export function useDataCubeComponentTermsetsQuery(options: Omit<Urql.UseQueryArgs<DataCubeComponentTermsetsQueryVariables>, 'query'>) {
  return Urql.useQuery<DataCubeComponentTermsetsQuery, DataCubeComponentTermsetsQueryVariables>({ query: DataCubeComponentTermsetsDocument, ...options });
};
export const DataCubeObservationsDocument = gql`
    query DataCubeObservations($sourceType: String!, $sourceUrl: DataSourceUrl!, $locale: String!, $cubeFilter: DataCubeObservationFilter!) {
  dataCubeObservations(
    sourceType: $sourceType
    sourceUrl: $sourceUrl
    locale: $locale
    cubeFilter: $cubeFilter
  )
}
    `;

export function useDataCubeObservationsQuery(options: Omit<Urql.UseQueryArgs<DataCubeObservationsQueryVariables>, 'query'>) {
  return Urql.useQuery<DataCubeObservationsQuery, DataCubeObservationsQueryVariables>({ query: DataCubeObservationsDocument, ...options });
};
export const DataCubePreviewDocument = gql`
    query DataCubePreview($sourceType: String!, $sourceUrl: DataSourceUrl!, $locale: String!, $cubeFilter: DataCubePreviewFilter!) {
  dataCubePreview(
    sourceType: $sourceType
    sourceUrl: $sourceUrl
    locale: $locale
    cubeFilter: $cubeFilter
  )
}
    `;

export function useDataCubePreviewQuery(options: Omit<Urql.UseQueryArgs<DataCubePreviewQueryVariables>, 'query'>) {
  return Urql.useQuery<DataCubePreviewQuery, DataCubePreviewQueryVariables>({ query: DataCubePreviewDocument, ...options });
};
export const PossibleFiltersDocument = gql`
    query PossibleFilters($sourceType: String!, $sourceUrl: DataSourceUrl!, $cubeFilter: DataCubePossibleFiltersCubeFilter!) {
  possibleFilters(
    sourceType: $sourceType
    sourceUrl: $sourceUrl
    cubeFilter: $cubeFilter
  ) {
    type
    id
    value
  }
}
    `;

export function usePossibleFiltersQuery(options: Omit<Urql.UseQueryArgs<PossibleFiltersQueryVariables>, 'query'>) {
  return Urql.useQuery<PossibleFiltersQuery, PossibleFiltersQueryVariables>({ query: PossibleFiltersDocument, ...options });
};
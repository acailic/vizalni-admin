// Updated data structure to include organizations
export interface ChartConfig {
  name: string;
  type: string;
  xAxis: string;
  yAxis: string;
  groupBy?: string;
  filters?: Record<string, any>;
}

export interface DatasetInfo {
  id: string;
  slug: string;
  title: string;
  description?: string;
  sourceUrl?: string;
  publisher?: {
    name: string;
    identifier?: string;
  };
  organization?: {
    id: string;
    name: string;
    slug?: string;
    description?: string;
    identifier?: string;
  };
  issueDate?: string;
  modifiedDate?: string;
  frequency?: string;
  temporalCoverage?: {
    start: string;
    end: string;
  };
  spatialCoverage?: string[];
  tags?: string[];
  dataQuality?: {
    completeness: number;
    accuracy: number;
    consistency: number;
    timeliness: number;
  };
  visualizations?: ChartConfig[];
}

export interface PublicDataPortal {
  id: string;
  name: string;
  baseUrl: string;
  type: 'CKAN' | 'DKAN' | 'Socrata' | 'OGC';
  country: string;
  language: string;
  isEnabled: boolean;
  description?: string;
  organization?: string;
}

export interface DataGovPortalState {
  portals: PublicDataPortal[];
  datasets: DatasetInfo[];
  selectedPortal: PublicDataPortal | null;
  selectedDatasets: DatasetInfo[];
  searchFilters: {
    query?: string;
    tags?: string[];
    organizations?: string[]; // New field for organization filtering
    dateRange?: {
      start: string;
      end: string;
    };
    dataQuality?: {
      minCompleteness: number;
      minAccuracy: number;
    };
  };
  viewMode: 'grid' | 'list'; // New field for view modes
  loading: boolean;
  error?: string;
}
// app/types/topics.ts

export interface LocalizedString {
  sr: string;
  "sr-Latn"?: string;
  en: string;
}

export interface Topic {
  id: string;
  title: LocalizedString;
  icon: string;
  description: LocalizedString;
  datasetCount: number;
}

export interface Dataset {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  dataGovRsId: string;
  dataGovRsUrl: string;
  tags: string[];
  lastUpdated: string;
  format: "CSV" | "JSON" | "XLSX" | "XML";
  recommendedChart?: "bar" | "line" | "pie" | "map" | "area";
}

export interface Visualization {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  chartType: "bar" | "line" | "pie" | "area" | "column";
  dataSource: string;
  embedUrl?: string;
}

export interface TopicData {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  datasets: Dataset[];
  visualizations?: Visualization[];
}

export interface TopicIndex {
  topics: Topic[];
}

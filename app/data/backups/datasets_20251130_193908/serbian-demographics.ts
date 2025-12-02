/**
 * Serbian Demographics Datasets
 * Source: data.gov.rs - Open Data Portal Republic of Serbia
 */

export interface DemographicsDataset {
  id: string;
  title: string;
  organization: string;
  tags: string[];
  format: string;
  url: string;
  description?: string;
  category: string;
}

/**
 * Demographics datasets from Serbian Open Data Portal
 */
export const serbianDemographicsData: DemographicsDataset[] = [
  {
    id: "population-census-2022",
    title: "Popis stanovništva 2022",
    organization: "Republički zavod za statistiku",
    tags: ["popis", "stanovništvo", "demografija"],
    format: "CSV",
    url: "https://data.gov.rs/datasets/population-census-2022",
    description: "Rezultati popisa stanovništva, domaćinstava i stanova 2022. godine",
    category: "demographics"
  },
  {
    id: "population-projection-2050",
    title: "Projekcija stanovništva do 2050",
    organization: "Republički zavod za statistiku",
    tags: ["projekcija", "stanovništvo", "demografija"],
    format: "JSON",
    url: "https://data.gov.rs/datasets/population-projection-2050",
    description: "Demografske projekcije stanovništva Republike Srbije do 2050. godine",
    category: "demographics"
  },
  {
    id: "migration-statistics-2023",
    title: "Statistika migracija 2023",
    organization: "Republički zavod za statistiku",
    tags: ["migracija", "stanovništvo", "seobe"],
    format: "CSV",
    url: "https://data.gov.rs/datasets/migration-statistics-2023",
    description: "Godišnja statistika migracija stanovništva Republike Srbije",
    category: "demographics"
  },
];

/**
 * Export all datasets as default
 */
export default serbianDemographicsData;

/**
 * Get datasets by organization
 */
export const getDatasetsByOrganization = (org: string): DemographicsDataset[] => {
  return serbianDemographicsData.filter(dataset =>
    dataset.organization.toLowerCase().includes(org.toLowerCase())
  );
};

/**
 * Get datasets by format
 */
export const getDatasetsByFormat = (format: string): DemographicsDataset[] => {
  return serbianDemographicsData.filter(dataset =>
    dataset.format.toUpperCase() === format.toUpperCase()
  );
};

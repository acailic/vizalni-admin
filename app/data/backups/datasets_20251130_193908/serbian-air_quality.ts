/**
 * Serbian Air_Quality Datasets
 * Source: data.gov.rs - Open Data Portal Republic of Serbia
 */

export interface Air_QualityDataset {
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
 * Air_Quality datasets from Serbian Open Data Portal
 */
export const serbianAir_QualityData: Air_QualityDataset[] = [
  {
    id: "air-quality-stations-2024",
    title: "Stanice za merenje kvaliteta vazduha 2024",
    organization: "Agencija za zaštitu životne sredine",
    tags: ["kvalitet vazduha", "PM10", "PM2.5", "zagađenje"],
    format: "JSON",
    url: "https://data.gov.rs/datasets/air-quality-stations-2024",
    description: "Lokacije i podaci sa stanica za merenje kvaliteta vazduha",
    category: "air_quality"
  },
  {
    id: "pm10-daily-belgrade-2024",
    title: "Dnevne vrednosti PM10 Beograd 2024",
    organization: "Sekretarijat za zaštitu životne sredine",
    tags: ["PM10", "kvalitet vazduha", "Beograd", "zagađenje"],
    format: "CSV",
    url: "https://data.gov.rs/datasets/pm10-daily-belgrade-2024",
    description: "Dnevne vrednosti čestica PM10 za teritoriju grada Beograda",
    category: "air_quality"
  },
  {
    id: "air-quality-annual-report-2023",
    title: "Godišnji izveštaj o kvalitetu vazduha 2023",
    organization: "Agencija za zaštitu životne sredine",
    tags: ["kvalitet vazduha", "izveštaj", "godišnji"],
    format: "PDF",
    url: "https://data.gov.rs/datasets/air-quality-annual-report-2023",
    description: "Kompletan godišnji izveštaj o stanju kvaliteta vazduha u Srbiji",
    category: "air_quality"
  },
];

/**
 * Export all datasets as default
 */
export default serbianAir_QualityData;

/**
 * Get datasets by organization
 */
export const getDatasetsByOrganization = (org: string): Air_QualityDataset[] => {
  return serbianAir_QualityData.filter(dataset =>
    dataset.organization.toLowerCase().includes(org.toLowerCase())
  );
};

/**
 * Get datasets by format
 */
export const getDatasetsByFormat = (format: string): Air_QualityDataset[] => {
  return serbianAir_QualityData.filter(dataset =>
    dataset.format.toUpperCase() === format.toUpperCase()
  );
};

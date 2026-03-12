/**
 * Serbian Energy Datasets
 * Source: data.gov.rs - Open Data Portal Republic of Serbia
 */

export interface EnergyDataset {
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
 * Energy datasets from Serbian Open Data Portal
 */
export const serbianEnergyData: EnergyDataset[] = [
  {
    id: "energy-production-2024",
    title: "Proizvodnja energije 2024",
    organization: "Ministarstvo rudarstva i energetike",
    tags: ["energija", "proizvodnja", "elektrane"],
    format: "CSV",
    url: "https://data.gov.rs/datasets/energy-production-2024",
    description: "Mesečna proizvodnja električne energije po tipovima elektrana",
    category: "energy"
  },
  {
    id: "renewable-energy-2024",
    title: "Obnovljivi izvori energije 2024",
    organization: "Agencija za energetiku",
    tags: ["obnovljiva energija", "vetar", "sunce", "voda"],
    format: "JSON",
    url: "https://data.gov.rs/datasets/renewable-energy-2024",
    description: "Instalirani kapaciteti i proizvodnja iz obnovljivih izvora energije",
    category: "energy"
  },
  {
    id: "energy-consumption-2023",
    title: "Potrošnja energije 2023",
    organization: "Elektrodistribucija Srbije",
    tags: ["potrošnja", "energija", "elektrodistribucija"],
    format: "CSV",
    url: "https://data.gov.rs/datasets/energy-consumption-2023",
    description: "Godišnja potrošnja električne energije po sektorima",
    category: "energy"
  },
];

/**
 * Export all datasets as default
 */
export default serbianEnergyData;

/**
 * Get datasets by organization
 */
export const getDatasetsByOrganization = (org: string): EnergyDataset[] => {
  return serbianEnergyData.filter(dataset =>
    dataset.organization.toLowerCase().includes(org.toLowerCase())
  );
};

/**
 * Get datasets by format
 */
export const getDatasetsByFormat = (format: string): EnergyDataset[] => {
  return serbianEnergyData.filter(dataset =>
    dataset.format.toUpperCase() === format.toUpperCase()
  );
};

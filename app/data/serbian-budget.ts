/**
 * Serbian Budget Datasets
 * Source: data.gov.rs - Open Data Portal Republic of Serbia
 */

export interface BudgetDataset {
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
 * Budget datasets from Serbian Open Data Portal
 */
export const serbianBudgetData: BudgetDataset[] = [
  {
    id: "budget-republic-serbia-2024",
    title: "Budžet Republike Srbije 2024",
    organization: "Ministarstvo finansija",
    tags: ["budžet", "finansije", "rashodi", "prihodi"],
    format: "CSV",
    url: "https://data.gov.rs/datasets/budget-republic-serbia-2024",
    description: "Godišnji budžet Republike Srbije sa detaljnom podelom rashoda i prihoda",
    category: "budget"
  },
  {
    id: "municipal-budgets-2024",
    title: "Budžeti opština 2024",
    organization: "Uprava za trezor",
    tags: ["budžet", "opštine", "finansije", "lokalna samouprava"],
    format: "JSON",
    url: "https://data.gov.rs/datasets/municipal-budgets-2024",
    description: "Budžeti svih opština u Srbiji za 2024. godinu",
    category: "budget"
  },
];

/**
 * Export all datasets as default
 */
export default serbianBudgetData;

/**
 * Get datasets by organization
 */
export const getDatasetsByOrganization = (org: string): BudgetDataset[] => {
  return serbianBudgetData.filter(dataset =>
    dataset.organization.toLowerCase().includes(org.toLowerCase())
  );
};

/**
 * Get datasets by format
 */
export const getDatasetsByFormat = (format: string): BudgetDataset[] => {
  return serbianBudgetData.filter(dataset =>
    dataset.format.toUpperCase() === format.toUpperCase()
  );
};

import { ObservationValue } from '../domain/data';

export interface FilterCondition {
  dimension: string;
  value: ObservationValue;
  operator?: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin';
}

export interface SingleFilter {
  dimension: string;
  value: ObservationValue;
}

export interface Filters {
  dimensions: Record<string, FilterCondition[]>;
  measures?: Record<string, FilterCondition[]>;
}

export * from "./components/configurator";
export * from "./config-form";
export * from "../config-types";
export * from "./configurator-state";

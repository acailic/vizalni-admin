/**
 * Main Entry Point for @acailic/vizualni-admin
 *
 * This is the primary export file that re-exports all public APIs.
 * For tree-shaking support, consumers can also import from sub-paths:
 * - @acailic/vizualni-admin/core - Locale, config, validation
 * - @acailic/vizualni-admin/client - DataGovRs API client
 * - @acailic/vizualni-admin/charts - Standalone chart components
 * - @acailic/vizualni-admin/hooks - React hooks
 * - @acailic/vizualni-admin/utils - Utility functions
 *
 * @packageDocumentation
 */

// Re-export everything from the main index
export * from "../index";

// Re-export chart components
export * from "./charts";

// Re-export hooks
export * from "./hooks";

// Re-export utilities
export * from "./utils";

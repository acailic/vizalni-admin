/**
 * Entry point for @acailic/vizualni-admin package
 *
 * This is a minimal beta release that exports only standalone utilities.
 * Full component exports (Configurator, etc.) require the entire Next.js app context
 * and will be added in future releases.
 */

// Re-export from @lingui/react for convenience
export { I18nProvider } from "@lingui/react";

// Export locale utilities (these are standalone and don't depend on Next.js)
export { defaultLocale, locales, parseLocaleString } from "./locales/locales";
export type { Locale } from "./locales/locales";

// Export config types for external consumers
export type * from "./config-types";

// Note: Configurator, ConfiguratorStateProvider, and other components
// are not exported in this beta as they have deep dependencies on the
// Next.js app structure. They will be refactored for standalone use
// in a future release.

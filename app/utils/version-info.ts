/**
 * Version and git commit information for display in footer
 * These values are injected at build time
 */

// Get version from package.json via npm environment variable or fallback
export const version = process.env.npm_package_version || "0.1.0-beta.1";

// Get git commit hash from environment variables
// Supports: local builds (GIT_COMMIT_HASH), Vercel (VERCEL_GIT_COMMIT_SHA)
export const gitCommitHash =
  process.env.GIT_COMMIT_HASH ||
  process.env.VERCEL_GIT_COMMIT_SHA ||
  "development";

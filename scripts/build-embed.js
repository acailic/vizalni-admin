/**
 * Build script for the embed bundle using esbuild
 * Replaces legacy Rollup/Babel configuration
 */

import * as esbuild from "esbuild";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

async function buildEmbed() {
  try {
    await esbuild.build({
      entryPoints: [join(rootDir, "embed/index.tsx")],
      bundle: true,
      minify: true,
      outfile: join(rootDir, "app/public/dist/embed.js"),
      format: "iife",
      globalName: "VisualizeEmbed",
      platform: "browser",
      target: ["es2018"],
      define: {
        "process.env.NODE_ENV": '"production"',
      },
      banner: {
        js: "var global = typeof globalThis !== 'undefined' ? globalThis : (typeof self !== 'undefined' ? self : this);",
      },
      logLevel: "info",
    });
    console.log("Embed bundle built successfully");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

buildEmbed();

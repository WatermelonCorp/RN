/**
 * Workaround for @opennextjs/cloudflare compatibility with Next.js 16.
 * 
 * App-router-only projects may not generate pages-manifest.json in the
 * standalone output. This script creates it if missing.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import path from "node:path";

const dotNextDir = path.resolve(process.cwd(), ".next");
const standaloneNextDir = path.join(dotNextDir, "standalone", ".next");
const standaloneServerDir = path.join(standaloneNextDir, "server");

// Ensure standalone server directory exists
if (!existsSync(standaloneServerDir)) {
  mkdirSync(standaloneServerDir, { recursive: true });
  console.log("Created standalone server directory:", standaloneServerDir);
}

// Ensure BUILD_ID exists in standalone
const buildIdSrc = path.join(dotNextDir, "BUILD_ID");
const buildIdDst = path.join(standaloneNextDir, "BUILD_ID");
if (existsSync(buildIdSrc) && !existsSync(buildIdDst)) {
  mkdirSync(path.dirname(buildIdDst), { recursive: true });
  copyFileSync(buildIdSrc, buildIdDst);
  console.log("Copied BUILD_ID to standalone:", buildIdDst);
}

// Ensure pages-manifest.json exists
const manifestPath = path.join(standaloneServerDir, "pages-manifest.json");
if (!existsSync(manifestPath)) {
  writeFileSync(manifestPath, JSON.stringify({}, null, 2));
  console.log("Created empty pages-manifest.json at:", manifestPath);
}

console.log("Standalone output verified.");

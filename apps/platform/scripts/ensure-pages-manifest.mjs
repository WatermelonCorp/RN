/**
 * Workaround for @opennextjs/cloudflare expecting pages-manifest.json
 * in the standalone output. Next.js 16 app-router-only projects don't
 * generate this file, causing the build to fail with ENOENT.
 *
 * This script creates an empty pages-manifest.json if it doesn't exist.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const dotNextDir = path.resolve(process.cwd(), ".next");
const standaloneServerDir = path.join(dotNextDir, "standalone", ".next", "server");
const manifestPath = path.join(standaloneServerDir, "pages-manifest.json");

if (!existsSync(manifestPath)) {
  mkdirSync(standaloneServerDir, { recursive: true });
  writeFileSync(manifestPath, JSON.stringify({}, null, 2));
  console.log("Created empty pages-manifest.json at:", manifestPath);
} else {
  console.log("pages-manifest.json already exists, skipping.");
}

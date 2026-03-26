/**
 * Workaround for @opennextjs/cloudflare compatibility with Next.js 16.
 *
 * Next 16 may leave manifests only in the root `.next` directory, while
 * OpenNext expects them under `.next/standalone/.next`.
 */
import { existsSync, mkdirSync, writeFileSync, copyFileSync } from "node:fs";
import path from "node:path";

const dotNextDir = path.resolve(process.cwd(), ".next");
const standaloneNextDir = path.join(dotNextDir, "standalone", ".next");
const standaloneServerDir = path.join(standaloneNextDir, "server");

const ensureDir = (dirPath) => {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
    console.log("Created directory:", dirPath);
  }
};

const copyIfPresent = (src, dst) => {
  if (!existsSync(src)) return false;

  ensureDir(path.dirname(dst));
  copyFileSync(src, dst);
  console.log("Copied manifest to standalone:", dst);
  return true;
};

ensureDir(standaloneServerDir);

// Ensure BUILD_ID exists in standalone
const buildIdSrc = path.join(dotNextDir, "BUILD_ID");
const buildIdDst = path.join(standaloneNextDir, "BUILD_ID");
copyIfPresent(buildIdSrc, buildIdDst);

// Mirror manifests that OpenNext reads from the standalone `.next` folder.
[
  "required-server-files.json",
  "prerender-manifest.json",
  "routes-manifest.json",
  "app-path-routes-manifest.json",
].forEach((file) => {
  copyIfPresent(path.join(dotNextDir, file), path.join(standaloneNextDir, file));
});

[
  "app-paths-manifest.json",
  "middleware-manifest.json",
  "functions-config-manifest.json",
  "pages-manifest.json",
  "next-font-manifest.json",
  "server-reference-manifest.json",
  "prefetch-hints.json",
].forEach((file) => {
  copyIfPresent(path.join(dotNextDir, "server", file), path.join(standaloneServerDir, file));
});

// Ensure pages-manifest.json exists
const manifestPath = path.join(standaloneServerDir, "pages-manifest.json");
if (!existsSync(manifestPath)) {
  writeFileSync(manifestPath, JSON.stringify({}, null, 2));
  console.log("Created empty pages-manifest.json at:", manifestPath);
}

console.log("Standalone output verified.");

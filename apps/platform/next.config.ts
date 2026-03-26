import path from "node:path";
import { createMDX } from "fumadocs-mdx/next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const withMDX = createMDX();
const workspaceRoot = path.join(__dirname, "../..");

const nextConfig = {
  output: "standalone" as const,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  outputFileTracingRoot: workspaceRoot,
  turbopack: {
    root: workspaceRoot,
  },
};

export default withMDX(nextConfig);

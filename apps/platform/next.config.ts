import path from "node:path";
import createMDX from "@next/mdx";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const withMDX = createMDX();
const workspaceRoot = path.join(__dirname, "../..");

const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  outputFileTracingRoot: workspaceRoot,
  turbopack: {
    root: workspaceRoot,
  },
};

export default withMDX(nextConfig);

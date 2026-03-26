import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const cwdSpotlightSourcePath = path.resolve(
  process.cwd(),
  "components/animated/spotlight-button.tsx",
);

const siblingShowcaseSpotlightSourcePath = path.resolve(
  process.cwd(),
  "../showcase/components/animated/spotlight-button.tsx",
);

const rootShowcaseSpotlightSourcePath = path.resolve(
  process.cwd(),
  "apps/showcase/components/animated/spotlight-button.tsx",
);

const spotlightSourcePath = existsSync(cwdSpotlightSourcePath)
  ? cwdSpotlightSourcePath
  : existsSync(siblingShowcaseSpotlightSourcePath)
    ? siblingShowcaseSpotlightSourcePath
    : rootShowcaseSpotlightSourcePath;

export const customShowcaseItems = [
  {
    slug: "spotlight-button",
    name: "spotlight-button",
    title: "Spotlight Button",
    description:
      "An animated call-to-action button with shimmer, glow, and directional hover motion.",
    category: "Animated Components",
    dependencies: ["class-variance-authority", "lucide-react", "motion"],
    registryDependencies: [],
    installCommand: "pnpm add motion class-variance-authority lucide-react",
    sourcePath: "components/animated/spotlight-button.tsx",
    source: readFileSync(spotlightSourcePath, "utf8"),
  },
] as const;

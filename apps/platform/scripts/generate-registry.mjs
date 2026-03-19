import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

async function generateRegistryData() {
  const root = process.cwd();
  const registryRoot = path.join(root, "..", "..", "packages", "registry");
  const registryPath = path.join(registryRoot, "registry.json");
  
  console.log("Reading registry from:", registryPath);
  const registryRaw = await readFile(registryPath, "utf8");
  const registry = JSON.parse(registryRaw);

  const items = await Promise.all(
    Object.entries(registry.components).map(async ([slug, component]) => {
      const primaryFile = component.files[0];
      const sourcePath = path.join(registryRoot, "src", primaryFile.path);
      const source = await readFile(sourcePath, "utf8");

      return {
        slug,
        name: component.name,
        dependencies: component.dependencies ?? [],
        registryDependencies: component.registryDependencies ?? [],
        sourcePath: primaryFile.path,
        source,
      };
    })
  );

  const outputPath = path.join(root, "lib", "registry-data.json");
  await writeFile(outputPath, JSON.stringify(items, null, 2));
  console.log("Generated registry data to:", outputPath);
}

generateRegistryData().catch(console.error);

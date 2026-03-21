import fs from 'fs-extra';
import path from 'path';
import type { WatermelonConfig } from './config.js';
import type { RegistryFile, ResolvedComponent } from './registry.js';

export interface InstallFilesOptions {
    cwd: string;
    config: WatermelonConfig;
    installPath?: string;
    force?: boolean;
    dryRun?: boolean;
    downloadFile: (component: ResolvedComponent, file: RegistryFile) => Promise<string>;
}

export interface PlannedFile {
    targetPath: string;
    relativePath: string;
    exists: boolean;
}

export async function installFiles(
    components: ResolvedComponent[],
    options: InstallFilesOptions
): Promise<PlannedFile[]> {
    const plannedFiles: PlannedFile[] = [];
    const targetRoot = resolveTargetRoot(options.cwd, options.installPath);

    for (const component of components) {
        for (const file of component.manifest.files) {
            const targetPath = path.join(targetRoot, file.path);
            const exists = await fs.pathExists(targetPath);

            if (exists && !options.force) {
                throw new Error(
                    `File already exists: ${path.relative(options.cwd, targetPath)}. Re-run with --force to overwrite.`
                );
            }

            plannedFiles.push({
                targetPath,
                relativePath: path.relative(options.cwd, targetPath),
                exists,
            });

            if (options.dryRun) {
                continue;
            }

            const content = await options.downloadFile(component, file);
            const transformedContent = transformImports(content, options.config);

            await fs.ensureDir(path.dirname(targetPath));
            await fs.writeFile(targetPath, transformedContent, 'utf-8');
        }
    }

    return plannedFiles;
}

export function transformImports(content: string, config: WatermelonConfig): string {
    let transformed = content;

    transformed = transformed.replace(/@\/registry\/components/g, config.aliases.components);
    transformed = transformed.replace(/@\/registry\/lib/g, path.dirname(config.aliases.utils));

    return transformed;
}

export async function ensureUtilsFile(cwd: string, config: WatermelonConfig): Promise<void> {
    const utilsContent = `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
`;

    const utilsPath = config.aliases.utils.replace('@/', '');
    const fullPath = path.join(cwd, utilsPath + '.ts');

    if (!(await fs.pathExists(fullPath))) {
        await fs.ensureDir(path.dirname(fullPath));
        await fs.writeFile(fullPath, utilsContent, 'utf-8');
    }
}

export async function ensureComponentsDirectory(cwd: string, config: WatermelonConfig): Promise<void> {
    const componentsPath = config.aliases.components.replace('@/', '');
    await fs.ensureDir(path.join(cwd, componentsPath, 'ui'));
}

function resolveTargetRoot(cwd: string, installPath?: string): string {
    if (!installPath) {
        return cwd;
    }

    return path.isAbsolute(installPath)
        ? installPath
        : path.join(cwd, installPath);
}

import fs from 'fs-extra';
import path from 'path';
import type { WatermelonConfig } from './config.js';

export async function writeComponent(
    targetPath: string,
    content: string,
    cwd: string
): Promise<void> {
    const fullPath = path.join(cwd, targetPath);
    await fs.ensureDir(path.dirname(fullPath));
    await fs.writeFile(fullPath, content, 'utf-8');
}

export function transformImports(content: string, config: WatermelonConfig): string {
    let transformed = content;

    // Transform @/registry/* imports to @/components/*
    transformed = transformed.replace(
        /@\/registry\/components/g,
        config.aliases.components
    );

    transformed = transformed.replace(
        /@\/registry\/lib/g,
        path.dirname(config.aliases.utils)
    );

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

    const exists = await fs.pathExists(fullPath);
    if (!exists) {
        await fs.ensureDir(path.dirname(fullPath));
        await fs.writeFile(fullPath, utilsContent, 'utf-8');
    }
}

export async function ensureComponentsDirectory(cwd: string, config: WatermelonConfig): Promise<void> {
    const componentsPath = config.aliases.components.replace('@/', '');
    const uiPath = path.join(cwd, componentsPath, 'ui');
    await fs.ensureDir(uiPath);
}

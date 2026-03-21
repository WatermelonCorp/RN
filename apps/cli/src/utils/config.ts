import fs from 'fs-extra';
import path from 'path';

export interface WatermelonConfig {
    $schema?: string;
    style: string;
    tailwind: {
        config: string;
        css: string;
        baseColor: string;
    };
    aliases: {
        components: string;
        utils: string;
    };
    registries: Record<string, RegistrySource>;
    defaultRegistry: string;
}

export interface RegistryDirectoryEntry {
    name: string;
    homepage?: string;
    url: string;
    description?: string;
}

export type RegistrySource = string | RegistryDirectoryEntry;

export const DEFAULT_REGISTRIES = {
    '@watermelon': {
        name: '@watermelon',
        homepage: 'https://registry.watermelon.dev',
        url: 'https://registry.watermelon.dev/{name}.json',
        description: 'Official Watermelon component registry.',
    },
    '@aceternity': {
        name: '@aceternity',
        homepage: 'https://aceternity.com',
        url: 'https://aceternity.com/registry/{name}.json',
        description: 'Aceternity component registry.',
    },
} satisfies Record<string, RegistrySource>;

export const DEFAULT_CONFIG: WatermelonConfig = {
    style: 'default',
    tailwind: {
        config: 'tailwind.config.js',
        css: 'global.css',
        baseColor: 'slate',
    },
    aliases: {
        components: '@/components',
        utils: '@/lib/utils',
    },
    registries: DEFAULT_REGISTRIES,
    defaultRegistry: 'https://registry.watermelon.dev/{name}.json',
};

const CONFIG_FILE = 'watermelon.json';

export async function getConfig(cwd: string): Promise<WatermelonConfig | null> {
    try {
        const configPath = path.join(cwd, CONFIG_FILE);
        const configExists = await fs.pathExists(configPath);

        if (!configExists) {
            return null;
        }

        const config = await fs.readJson(configPath) as Partial<WatermelonConfig>;
        return mergeConfig(config);
    } catch {
        return null;
    }
}

export async function setConfig(cwd: string, config: WatermelonConfig): Promise<void> {
    const configPath = path.join(cwd, CONFIG_FILE);
    await fs.writeJson(configPath, config, { spaces: 2 });
}

export function mergeConfig(config: Partial<WatermelonConfig>): WatermelonConfig {
    return {
        ...DEFAULT_CONFIG,
        ...config,
        tailwind: {
            ...DEFAULT_CONFIG.tailwind,
            ...config.tailwind,
        },
        aliases: {
            ...DEFAULT_CONFIG.aliases,
            ...config.aliases,
        },
        registries: {
            ...DEFAULT_CONFIG.registries,
            ...config.registries,
        },
        defaultRegistry: config.defaultRegistry ?? DEFAULT_CONFIG.defaultRegistry,
    };
}

export function isRegistryDirectoryEntry(value: RegistrySource): value is RegistryDirectoryEntry {
    return typeof value === 'object' && value !== null && 'url' in value && 'name' in value;
}

export function resolveImport(alias: string, config: WatermelonConfig): string {
    if (alias === '@/components') {
        return config.aliases.components;
    }

    if (alias === '@/lib/utils') {
        return config.aliases.utils;
    }

    return alias;
}

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
}

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
};

export const REGISTRY_URL = 'https://raw.githubusercontent.com/vanshpatelx/RN/main/watermelon/packages/registry';

export async function getConfig(cwd: string): Promise<WatermelonConfig | null> {
    try {
        const configPath = path.join(cwd, 'watermelon.json');
        const configExists = await fs.pathExists(configPath);

        if (!configExists) {
            return null;
        }

        const config = await fs.readJson(configPath);
        return config as WatermelonConfig;
    } catch (error) {
        return null;
    }
}

export async function setConfig(cwd: string, config: WatermelonConfig): Promise<void> {
    const configPath = path.join(cwd, 'watermelon.json');
    await fs.writeJson(configPath, config, { spaces: 2 });
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

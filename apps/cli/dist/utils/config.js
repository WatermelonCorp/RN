"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CONFIG = exports.DEFAULT_REGISTRIES = void 0;
exports.getConfig = getConfig;
exports.setConfig = setConfig;
exports.mergeConfig = mergeConfig;
exports.isRegistryDirectoryEntry = isRegistryDirectoryEntry;
exports.resolveImport = resolveImport;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
exports.DEFAULT_REGISTRIES = {
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
};
exports.DEFAULT_CONFIG = {
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
    registries: exports.DEFAULT_REGISTRIES,
    defaultRegistry: 'https://registry.watermelon.dev/{name}.json',
};
const CONFIG_FILE = 'watermelon.json';
async function getConfig(cwd) {
    try {
        const configPath = path_1.default.join(cwd, CONFIG_FILE);
        const configExists = await fs_extra_1.default.pathExists(configPath);
        if (!configExists) {
            return null;
        }
        const config = await fs_extra_1.default.readJson(configPath);
        return mergeConfig(config);
    }
    catch {
        return null;
    }
}
async function setConfig(cwd, config) {
    const configPath = path_1.default.join(cwd, CONFIG_FILE);
    await fs_extra_1.default.writeJson(configPath, config, { spaces: 2 });
}
function mergeConfig(config) {
    return {
        ...exports.DEFAULT_CONFIG,
        ...config,
        tailwind: {
            ...exports.DEFAULT_CONFIG.tailwind,
            ...config.tailwind,
        },
        aliases: {
            ...exports.DEFAULT_CONFIG.aliases,
            ...config.aliases,
        },
        registries: {
            ...exports.DEFAULT_CONFIG.registries,
            ...config.registries,
        },
        defaultRegistry: config.defaultRegistry ?? exports.DEFAULT_CONFIG.defaultRegistry,
    };
}
function isRegistryDirectoryEntry(value) {
    return typeof value === 'object' && value !== null && 'url' in value && 'name' in value;
}
function resolveImport(alias, config) {
    if (alias === '@/components') {
        return config.aliases.components;
    }
    if (alias === '@/lib/utils') {
        return config.aliases.utils;
    }
    return alias;
}

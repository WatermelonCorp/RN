"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.REGISTRY_URL = exports.DEFAULT_CONFIG = void 0;
exports.getConfig = getConfig;
exports.setConfig = setConfig;
exports.resolveImport = resolveImport;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
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
};
exports.REGISTRY_URL = 'https://raw.githubusercontent.com/vanshpatelx/RN/main/packages/registry';
async function getConfig(cwd) {
    try {
        const configPath = path_1.default.join(cwd, 'watermelon.json');
        const configExists = await fs_extra_1.default.pathExists(configPath);
        if (!configExists) {
            return null;
        }
        const config = await fs_extra_1.default.readJson(configPath);
        return config;
    }
    catch (error) {
        return null;
    }
}
async function setConfig(cwd, config) {
    const configPath = path_1.default.join(cwd, 'watermelon.json');
    await fs_extra_1.default.writeJson(configPath, config, { spaces: 2 });
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

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeComponent = writeComponent;
exports.transformImports = transformImports;
exports.ensureUtilsFile = ensureUtilsFile;
exports.ensureComponentsDirectory = ensureComponentsDirectory;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
async function writeComponent(targetPath, content, cwd) {
    const fullPath = path_1.default.join(cwd, targetPath);
    await fs_extra_1.default.ensureDir(path_1.default.dirname(fullPath));
    await fs_extra_1.default.writeFile(fullPath, content, 'utf-8');
}
function transformImports(content, config) {
    let transformed = content;
    // Transform @/registry/* imports to @/components/*
    transformed = transformed.replace(/@\/registry\/components/g, config.aliases.components);
    transformed = transformed.replace(/@\/registry\/lib/g, path_1.default.dirname(config.aliases.utils));
    return transformed;
}
async function ensureUtilsFile(cwd, config) {
    const utilsContent = `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
`;
    const utilsPath = config.aliases.utils.replace('@/', '');
    const fullPath = path_1.default.join(cwd, utilsPath + '.ts');
    const exists = await fs_extra_1.default.pathExists(fullPath);
    if (!exists) {
        await fs_extra_1.default.ensureDir(path_1.default.dirname(fullPath));
        await fs_extra_1.default.writeFile(fullPath, utilsContent, 'utf-8');
    }
}
async function ensureComponentsDirectory(cwd, config) {
    const componentsPath = config.aliases.components.replace('@/', '');
    const uiPath = path_1.default.join(cwd, componentsPath, 'ui');
    await fs_extra_1.default.ensureDir(uiPath);
}

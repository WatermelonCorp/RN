"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installFiles = installFiles;
exports.transformImports = transformImports;
exports.ensureUtilsFile = ensureUtilsFile;
exports.ensureComponentsDirectory = ensureComponentsDirectory;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
async function installFiles(components, options) {
    const plannedFiles = [];
    const targetRoot = resolveTargetRoot(options.cwd, options.installPath);
    for (const component of components) {
        for (const file of component.manifest.files) {
            const targetPath = path_1.default.join(targetRoot, file.path);
            const exists = await fs_extra_1.default.pathExists(targetPath);
            if (exists && !options.force) {
                throw new Error(`File already exists: ${path_1.default.relative(options.cwd, targetPath)}. Re-run with --force to overwrite.`);
            }
            plannedFiles.push({
                targetPath,
                relativePath: path_1.default.relative(options.cwd, targetPath),
                exists,
            });
            if (options.dryRun) {
                continue;
            }
            const content = await options.downloadFile(component, file);
            const transformedContent = transformImports(content, options.config);
            await fs_extra_1.default.ensureDir(path_1.default.dirname(targetPath));
            await fs_extra_1.default.writeFile(targetPath, transformedContent, 'utf-8');
        }
    }
    return plannedFiles;
}
function transformImports(content, config) {
    let transformed = content;
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
    if (!(await fs_extra_1.default.pathExists(fullPath))) {
        await fs_extra_1.default.ensureDir(path_1.default.dirname(fullPath));
        await fs_extra_1.default.writeFile(fullPath, utilsContent, 'utf-8');
    }
}
async function ensureComponentsDirectory(cwd, config) {
    const componentsPath = config.aliases.components.replace('@/', '');
    await fs_extra_1.default.ensureDir(path_1.default.join(cwd, componentsPath, 'ui'));
}
function resolveTargetRoot(cwd, installPath) {
    if (!installPath) {
        return cwd;
    }
    return path_1.default.isAbsolute(installPath)
        ? installPath
        : path_1.default.join(cwd, installPath);
}

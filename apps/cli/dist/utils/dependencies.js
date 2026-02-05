"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageManager = getPackageManager;
exports.installDependencies = installDependencies;
exports.getInstalledPackages = getInstalledPackages;
exports.getMissingDependencies = getMissingDependencies;
const execa_1 = require("execa");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const ora_1 = __importDefault(require("ora"));
async function getPackageManager(cwd) {
    // Check for lock files
    const hasPnpmLock = await fs_extra_1.default.pathExists(path_1.default.join(cwd, 'pnpm-lock.yaml'));
    const hasYarnLock = await fs_extra_1.default.pathExists(path_1.default.join(cwd, 'yarn.lock'));
    if (hasPnpmLock)
        return 'pnpm';
    if (hasYarnLock)
        return 'yarn';
    return 'npm';
}
async function installDependencies(dependencies, cwd, dev = false) {
    if (dependencies.length === 0)
        return;
    const packageManager = await getPackageManager(cwd);
    const spinner = (0, ora_1.default)(`Installing dependencies with ${packageManager}...`).start();
    try {
        let args = [];
        switch (packageManager) {
            case 'pnpm':
                args = ['add', ...dependencies];
                if (dev)
                    args.push('-D');
                break;
            case 'yarn':
                args = ['add', ...dependencies];
                if (dev)
                    args.push('--dev');
                break;
            case 'npm':
                args = ['install', ...dependencies];
                if (dev)
                    args.push('--save-dev');
                break;
        }
        await (0, execa_1.execa)(packageManager, args, { cwd });
        spinner.succeed(`Dependencies installed successfully`);
    }
    catch (error) {
        spinner.fail(`Failed to install dependencies`);
        throw error;
    }
}
async function getInstalledPackages(cwd) {
    try {
        const packageJsonPath = path_1.default.join(cwd, 'package.json');
        const packageJson = await fs_extra_1.default.readJson(packageJsonPath);
        const packages = new Set();
        if (packageJson.dependencies) {
            Object.keys(packageJson.dependencies).forEach(pkg => packages.add(pkg));
        }
        if (packageJson.devDependencies) {
            Object.keys(packageJson.devDependencies).forEach(pkg => packages.add(pkg));
        }
        return packages;
    }
    catch (error) {
        return new Set();
    }
}
async function getMissingDependencies(required, cwd) {
    const installed = await getInstalledPackages(cwd);
    return required.filter(dep => !installed.has(dep));
}

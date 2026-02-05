import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';

export async function getPackageManager(cwd: string): Promise<'npm' | 'pnpm' | 'yarn'> {
    // Check for lock files
    const hasPnpmLock = await fs.pathExists(path.join(cwd, 'pnpm-lock.yaml'));
    const hasYarnLock = await fs.pathExists(path.join(cwd, 'yarn.lock'));

    if (hasPnpmLock) return 'pnpm';
    if (hasYarnLock) return 'yarn';
    return 'npm';
}

export async function installDependencies(
    dependencies: string[],
    cwd: string,
    dev = false
): Promise<void> {
    if (dependencies.length === 0) return;

    const packageManager = await getPackageManager(cwd);
    const spinner = ora(`Installing dependencies with ${packageManager}...`).start();

    try {
        let args: string[] = [];

        switch (packageManager) {
            case 'pnpm':
                args = ['add', ...dependencies];
                if (dev) args.push('-D');
                break;
            case 'yarn':
                args = ['add', ...dependencies];
                if (dev) args.push('--dev');
                break;
            case 'npm':
                args = ['install', ...dependencies];
                if (dev) args.push('--save-dev');
                break;
        }

        await execa(packageManager, args, { cwd });
        spinner.succeed(`Dependencies installed successfully`);
    } catch (error) {
        spinner.fail(`Failed to install dependencies`);
        throw error;
    }
}

export async function getInstalledPackages(cwd: string): Promise<Set<string>> {
    try {
        const packageJsonPath = path.join(cwd, 'package.json');
        const packageJson = await fs.readJson(packageJsonPath);

        const packages = new Set<string>();

        if (packageJson.dependencies) {
            Object.keys(packageJson.dependencies).forEach(pkg => packages.add(pkg));
        }

        if (packageJson.devDependencies) {
            Object.keys(packageJson.devDependencies).forEach(pkg => packages.add(pkg));
        }

        return packages;
    } catch (error) {
        return new Set();
    }
}

export async function getMissingDependencies(
    required: string[],
    cwd: string
): Promise<string[]> {
    const installed = await getInstalledPackages(cwd);
    return required.filter(dep => !installed.has(dep));
}

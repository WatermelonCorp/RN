#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import prompts from 'prompts';
import ora from 'ora';
import { DEFAULT_CONFIG, getConfig, setConfig, type WatermelonConfig } from './utils/config.js';
import { collectComponents, downloadRegistryFile } from './utils/registry.js';
import { getMissingDependencies, installDependencies } from './utils/dependencies.js';
import { ensureComponentsDirectory, ensureUtilsFile, installFiles } from './utils/files.js';

const program = new Command();

program
    .name('watermelon')
    .description('CLI for Watermelon Design System')
    .version('0.0.2');

program
    .command('init')
    .description('Initialize Watermelon in your project')
    .action(async () => {
        console.log(chalk.bold.cyan('Watermelon setup\n'));

        const cwd = process.cwd();
        const existingConfig = await getConfig(cwd);

        if (existingConfig) {
            console.log(chalk.yellow('Watermelon is already initialized in this project.'));
            const { overwrite } = await prompts({
                type: 'confirm',
                name: 'overwrite',
                message: 'Do you want to overwrite the existing configuration?',
                initial: false,
            });

            if (!overwrite) {
                console.log(chalk.gray('Cancelled.'));
                return;
            }
        }

        const options = await prompts([
            {
                type: 'text',
                name: 'tailwindConfig',
                message: 'Where is your Tailwind config located?',
                initial: DEFAULT_CONFIG.tailwind.config,
            },
            {
                type: 'text',
                name: 'tailwindCss',
                message: 'Where is your global CSS file?',
                initial: DEFAULT_CONFIG.tailwind.css,
            },
            {
                type: 'text',
                name: 'componentsAlias',
                message: 'Configure the import alias for components:',
                initial: DEFAULT_CONFIG.aliases.components,
            },
            {
                type: 'text',
                name: 'utilsAlias',
                message: 'Configure the import alias for utils:',
                initial: DEFAULT_CONFIG.aliases.utils,
            },
        ]);

        const config: WatermelonConfig = {
            ...DEFAULT_CONFIG,
            tailwind: {
                ...DEFAULT_CONFIG.tailwind,
                config: options.tailwindConfig,
                css: options.tailwindCss,
            },
            aliases: {
                components: options.componentsAlias,
                utils: options.utilsAlias,
            },
        };

        const spinner = ora('Setting up project...').start();

        try {
            await setConfig(cwd, config);
            await ensureComponentsDirectory(cwd, config);
            await ensureUtilsFile(cwd, config);

            const requiredDeps = [
                'clsx',
                'tailwind-merge',
                'class-variance-authority',
                'nativewind',
            ];

            const missingDeps = await getMissingDependencies(requiredDeps, cwd);
            if (missingDeps.length > 0) {
                spinner.text = 'Installing dependencies...';
                await installDependencies(missingDeps, cwd);
            }

            spinner.succeed(chalk.green('Watermelon initialized successfully.'));
            console.log(`\n${chalk.bold('Next steps')}`);
            console.log(`  ${chalk.gray('Add a component:')} ${chalk.cyan('watermelon add button')}`);
            console.log(`  ${chalk.gray('Use a namespace:')} ${chalk.cyan('watermelon add @aceternity/card')}`);
        } catch (error) {
            spinner.fail('Failed to initialize Watermelon');
            console.error(chalk.red(getErrorMessage(error)));
            process.exit(1);
        }
    });

program
    .command('add')
    .description('Add components from one or more registries')
    .argument('<components...>', 'components to add')
    .option('-f, --force', 'overwrite existing files')
    .option('-p, --path <path>', 'custom install directory')
    .option('--dry-run', 'preview changes without writing files or installing dependencies')
    .action(async (components: string[], options: AddOptions) => {
        const cwd = process.cwd();
        const config = await getConfig(cwd);

        if (!config) {
            console.log(chalk.red('Watermelon is not initialized in this project.'));
            console.log(`${chalk.gray('Run')} ${chalk.cyan('watermelon init')} ${chalk.gray('first.')}`);
            process.exit(1);
        }

        const spinner = ora('Resolving component manifests...').start();

        try {
            const resolvedComponents = await collectComponents(components, config);
            spinner.succeed(`Resolved ${resolvedComponents.length} component${resolvedComponents.length === 1 ? '' : 's'}.`);

            const dependencyNames = Array.from(
                new Set(resolvedComponents.flatMap((component) => component.manifest.dependencies ?? []))
            ).sort();

            const missingDependencies = await getMissingDependencies(dependencyNames, cwd);

            if (options.dryRun) {
                printDryRunSummary(resolvedComponents, missingDependencies, options.path);
            } else if (missingDependencies.length > 0) {
                await installDependencies(missingDependencies, cwd);
            }

            const fileSpinner = ora(options.dryRun ? 'Planning file changes...' : 'Installing component files...').start();

            const plannedFiles = await installFiles(resolvedComponents, {
                cwd,
                config,
                installPath: options.path,
                force: options.force,
                dryRun: options.dryRun,
                downloadFile: (component, file) => downloadRegistryFile(component.specifier.fileBaseUrl, file),
            });

            fileSpinner.succeed(
                options.dryRun
                    ? `Planned ${plannedFiles.length} file change${plannedFiles.length === 1 ? '' : 's'}.`
                    : `Installed ${plannedFiles.length} file${plannedFiles.length === 1 ? '' : 's'}.`
            );

            if (options.dryRun) {
                printDryRunFiles(plannedFiles);
                return;
            }

            console.log(`\n${chalk.bold.green('Installed components')}`);
            for (const component of resolvedComponents) {
                console.log(`  ${chalk.cyan(component.specifier.raw)}`);
            }

            if (missingDependencies.length > 0) {
                console.log(`\n${chalk.bold('Installed dependencies')}`);
                console.log(`  ${missingDependencies.join(', ')}`);
            }
        } catch (error) {
            spinner.fail('Failed to add components');
            console.error(chalk.red(getErrorMessage(error)));
            process.exit(1);
        }
    });

program.parse();

type AddOptions = {
    force?: boolean;
    path?: string;
    dryRun?: boolean;
};

function printDryRunSummary(
    components: Awaited<ReturnType<typeof collectComponents>>,
    missingDependencies: string[],
    installPath?: string
) {
    console.log(`\n${chalk.bold('Dry run')}`);
    console.log(`  ${chalk.gray('Components:')} ${components.map((component) => component.specifier.raw).join(', ')}`);

    if (installPath) {
        console.log(`  ${chalk.gray('Install path:')} ${installPath}`);
    }

    if (missingDependencies.length > 0) {
        console.log(`  ${chalk.gray('Missing dependencies:')} ${missingDependencies.join(', ')}`);
    } else {
        console.log(`  ${chalk.gray('Missing dependencies:')} none`);
    }
}

function printDryRunFiles(
    plannedFiles: Array<{ relativePath: string; exists: boolean }>
) {
    if (plannedFiles.length === 0) {
        return;
    }

    console.log(`\n${chalk.bold('Files')}`);
    for (const file of plannedFiles) {
        const label = file.exists ? chalk.yellow('overwrite') : chalk.green('create');
        console.log(`  ${label} ${file.relativePath}`);
    }
}

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

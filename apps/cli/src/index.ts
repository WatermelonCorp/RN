#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import prompts from 'prompts';
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';
import { getConfig, setConfig, DEFAULT_CONFIG, type WatermelonConfig } from './utils/config.js';
import { fetchRegistry, fetchComponentFile, getAllComponentDependencies, type Registry } from './utils/registry.js';
import { installDependencies, getMissingDependencies } from './utils/dependencies.js';
import { writeComponent, transformImports, ensureUtilsFile, ensureComponentsDirectory } from './utils/files.js';

const program = new Command();

program
    .name('watermelon')
    .description('CLI for Watermelon Design System')
    .version('0.0.1');

program
    .command('init')
    .description('Initialize Watermelon in your project')
    .action(async () => {
        console.log(chalk.bold.cyan('🍉 Welcome to Watermelon!\n'));

        const cwd = process.cwd();
        const existingConfig = await getConfig(cwd);

        if (existingConfig) {
            console.log(chalk.yellow('⚠️  Watermelon is already initialized in this project.'));
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
            // Save config
            await setConfig(cwd, config);

            // Create directories
            await ensureComponentsDirectory(cwd, config);

            // Create utils file
            await ensureUtilsFile(cwd, config);

            // Install required dependencies
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

            spinner.succeed(chalk.green('✓ Watermelon initialized successfully!'));

            console.log('\n' + chalk.bold('Next steps:'));
            console.log(chalk.gray('  1. Add components: ') + chalk.cyan('watermelon add button'));
            console.log(chalk.gray('  2. Import in your app: ') + chalk.cyan('import { Button } from "@/components/ui/button"'));
            console.log('');
        } catch (error) {
            spinner.fail('Failed to initialize Watermelon');
            console.error(chalk.red(error instanceof Error ? error.message : String(error)));
            process.exit(1);
        }
    });

program
    .command('add')
    .description('Add components to your project')
    .argument('[components...]', 'components to add')
    .action(async (components: string[]) => {
        const cwd = process.cwd();
        const config = await getConfig(cwd);

        if (!config) {
            console.log(chalk.red('✗ Watermelon is not initialized in this project.'));
            console.log(chalk.gray('  Run ') + chalk.cyan('watermelon init') + chalk.gray(' first.'));
            return;
        }

        if (!components || components.length === 0) {
            console.log(chalk.red('✗ Please specify at least one component.'));
            console.log(chalk.gray('  Example: ') + chalk.cyan('watermelon add button'));
            return;
        }

        const spinner = ora('Fetching registry...').start();

        try {
            const registry = await fetchRegistry();
            spinner.succeed('Registry fetched');

            // Validate all components exist
            for (const componentName of components) {
                if (!registry.components[componentName]) {
                    console.log(chalk.red(`✗ Component "${componentName}" not found in registry.`));
                    console.log(chalk.gray('  Available components: ') +
                        Object.keys(registry.components).join(', '));
                    return;
                }
            }

            // Get all dependencies
            const allComponents = new Set<string>();
            for (const componentName of components) {
                const deps = getAllComponentDependencies(componentName, registry);
                deps.forEach(dep => allComponents.add(dep.name));
            }

            console.log(chalk.bold(`\nComponents to install: `) +
                Array.from(allComponents).join(', '));

            // Collect all npm dependencies
            const allNpmDeps = new Set<string>();
            for (const componentName of allComponents) {
                const component = registry.components[componentName];
                if (component.dependencies) {
                    component.dependencies.forEach(dep => allNpmDeps.add(dep));
                }
            }

            // Check for missing dependencies
            const missingDeps = await getMissingDependencies(
                Array.from(allNpmDeps),
                cwd
            );

            if (missingDeps.length > 0) {
                console.log(chalk.yellow(`\n📦 Installing ${missingDeps.length} dependencies...\n`));
                await installDependencies(missingDeps, cwd);
            }

            // Install components
            console.log(chalk.bold('\n📝 Installing components...\n'));

            for (const componentName of allComponents) {
                const componentSpinner = ora(`Installing ${componentName}...`).start();
                const component = registry.components[componentName];

                try {
                    for (const file of component.files) {
                        // Fetch the component file content
                        const content = await fetchComponentFile(file.path);

                        // Transform imports to use user's aliases
                        const transformedContent = transformImports(content, config);

                        // Write to disk
                        await writeComponent(file.path, transformedContent, cwd);
                    }

                    componentSpinner.succeed(chalk.green(`${componentName} installed`));
                } catch (error) {
                    componentSpinner.fail(chalk.red(`Failed to install ${componentName}`));
                    throw error;
                }
            }

            console.log(chalk.bold.green('\n✓ All components installed successfully!\n'));

        } catch (error) {
            spinner.fail('Failed to add components');
            console.error(chalk.red(error instanceof Error ? error.message : String(error)));
            process.exit(1);
        }
    });

program.parse();

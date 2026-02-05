#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const prompts_1 = __importDefault(require("prompts"));
const ora_1 = __importDefault(require("ora"));
const config_js_1 = require("./utils/config.js");
const registry_js_1 = require("./utils/registry.js");
const dependencies_js_1 = require("./utils/dependencies.js");
const files_js_1 = require("./utils/files.js");
const program = new commander_1.Command();
program
    .name('watermelon')
    .description('CLI for Watermelon Design System')
    .version('0.0.1');
program
    .command('init')
    .description('Initialize Watermelon in your project')
    .action(async () => {
    console.log(chalk_1.default.bold.cyan('🍉 Welcome to Watermelon!\n'));
    const cwd = process.cwd();
    const existingConfig = await (0, config_js_1.getConfig)(cwd);
    if (existingConfig) {
        console.log(chalk_1.default.yellow('⚠️  Watermelon is already initialized in this project.'));
        const { overwrite } = await (0, prompts_1.default)({
            type: 'confirm',
            name: 'overwrite',
            message: 'Do you want to overwrite the existing configuration?',
            initial: false,
        });
        if (!overwrite) {
            console.log(chalk_1.default.gray('Cancelled.'));
            return;
        }
    }
    const options = await (0, prompts_1.default)([
        {
            type: 'text',
            name: 'tailwindConfig',
            message: 'Where is your Tailwind config located?',
            initial: config_js_1.DEFAULT_CONFIG.tailwind.config,
        },
        {
            type: 'text',
            name: 'tailwindCss',
            message: 'Where is your global CSS file?',
            initial: config_js_1.DEFAULT_CONFIG.tailwind.css,
        },
        {
            type: 'text',
            name: 'componentsAlias',
            message: 'Configure the import alias for components:',
            initial: config_js_1.DEFAULT_CONFIG.aliases.components,
        },
        {
            type: 'text',
            name: 'utilsAlias',
            message: 'Configure the import alias for utils:',
            initial: config_js_1.DEFAULT_CONFIG.aliases.utils,
        },
    ]);
    const config = {
        ...config_js_1.DEFAULT_CONFIG,
        tailwind: {
            ...config_js_1.DEFAULT_CONFIG.tailwind,
            config: options.tailwindConfig,
            css: options.tailwindCss,
        },
        aliases: {
            components: options.componentsAlias,
            utils: options.utilsAlias,
        },
    };
    const spinner = (0, ora_1.default)('Setting up project...').start();
    try {
        // Save config
        await (0, config_js_1.setConfig)(cwd, config);
        // Create directories
        await (0, files_js_1.ensureComponentsDirectory)(cwd, config);
        // Create utils file
        await (0, files_js_1.ensureUtilsFile)(cwd, config);
        // Install required dependencies
        const requiredDeps = [
            'clsx',
            'tailwind-merge',
            'class-variance-authority',
            'nativewind',
        ];
        const missingDeps = await (0, dependencies_js_1.getMissingDependencies)(requiredDeps, cwd);
        if (missingDeps.length > 0) {
            spinner.text = 'Installing dependencies...';
            await (0, dependencies_js_1.installDependencies)(missingDeps, cwd);
        }
        spinner.succeed(chalk_1.default.green('✓ Watermelon initialized successfully!'));
        console.log('\n' + chalk_1.default.bold('Next steps:'));
        console.log(chalk_1.default.gray('  1. Add components: ') + chalk_1.default.cyan('watermelon add button'));
        console.log(chalk_1.default.gray('  2. Import in your app: ') + chalk_1.default.cyan('import { Button } from "@/components/ui/button"'));
        console.log('');
    }
    catch (error) {
        spinner.fail('Failed to initialize Watermelon');
        console.error(chalk_1.default.red(error instanceof Error ? error.message : String(error)));
        process.exit(1);
    }
});
program
    .command('add')
    .description('Add components to your project')
    .argument('[components...]', 'components to add')
    .action(async (components) => {
    const cwd = process.cwd();
    const config = await (0, config_js_1.getConfig)(cwd);
    if (!config) {
        console.log(chalk_1.default.red('✗ Watermelon is not initialized in this project.'));
        console.log(chalk_1.default.gray('  Run ') + chalk_1.default.cyan('watermelon init') + chalk_1.default.gray(' first.'));
        return;
    }
    if (!components || components.length === 0) {
        console.log(chalk_1.default.red('✗ Please specify at least one component.'));
        console.log(chalk_1.default.gray('  Example: ') + chalk_1.default.cyan('watermelon add button'));
        return;
    }
    const spinner = (0, ora_1.default)('Fetching registry...').start();
    try {
        const registry = await (0, registry_js_1.fetchRegistry)();
        spinner.succeed('Registry fetched');
        // Validate all components exist
        for (const componentName of components) {
            if (!registry.components[componentName]) {
                console.log(chalk_1.default.red(`✗ Component "${componentName}" not found in registry.`));
                console.log(chalk_1.default.gray('  Available components: ') +
                    Object.keys(registry.components).join(', '));
                return;
            }
        }
        // Get all dependencies
        const allComponents = new Set();
        for (const componentName of components) {
            const deps = (0, registry_js_1.getAllComponentDependencies)(componentName, registry);
            deps.forEach(dep => allComponents.add(dep.name));
        }
        console.log(chalk_1.default.bold(`\nComponents to install: `) +
            Array.from(allComponents).join(', '));
        // Collect all npm dependencies
        const allNpmDeps = new Set();
        for (const componentName of allComponents) {
            const component = registry.components[componentName];
            if (component.dependencies) {
                component.dependencies.forEach(dep => allNpmDeps.add(dep));
            }
        }
        // Check for missing dependencies
        const missingDeps = await (0, dependencies_js_1.getMissingDependencies)(Array.from(allNpmDeps), cwd);
        if (missingDeps.length > 0) {
            console.log(chalk_1.default.yellow(`\n📦 Installing ${missingDeps.length} dependencies...\n`));
            await (0, dependencies_js_1.installDependencies)(missingDeps, cwd);
        }
        // Install components
        console.log(chalk_1.default.bold('\n📝 Installing components...\n'));
        for (const componentName of allComponents) {
            const componentSpinner = (0, ora_1.default)(`Installing ${componentName}...`).start();
            const component = registry.components[componentName];
            try {
                for (const file of component.files) {
                    // Fetch the component file content
                    const content = await (0, registry_js_1.fetchComponentFile)(file.path);
                    // Transform imports to use user's aliases
                    const transformedContent = (0, files_js_1.transformImports)(content, config);
                    // Write to disk
                    await (0, files_js_1.writeComponent)(file.path, transformedContent, cwd);
                }
                componentSpinner.succeed(chalk_1.default.green(`${componentName} installed`));
            }
            catch (error) {
                componentSpinner.fail(chalk_1.default.red(`Failed to install ${componentName}`));
                throw error;
            }
        }
        console.log(chalk_1.default.bold.green('\n✓ All components installed successfully!\n'));
    }
    catch (error) {
        spinner.fail('Failed to add components');
        console.error(chalk_1.default.red(error instanceof Error ? error.message : String(error)));
        process.exit(1);
    }
});
program.parse();

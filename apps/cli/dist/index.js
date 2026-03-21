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
    .version('0.0.2');
program
    .command('init')
    .description('Initialize Watermelon in your project')
    .action(async () => {
    console.log(chalk_1.default.bold.cyan('Watermelon setup\n'));
    const cwd = process.cwd();
    const existingConfig = await (0, config_js_1.getConfig)(cwd);
    if (existingConfig) {
        console.log(chalk_1.default.yellow('Watermelon is already initialized in this project.'));
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
        await (0, config_js_1.setConfig)(cwd, config);
        await (0, files_js_1.ensureComponentsDirectory)(cwd, config);
        await (0, files_js_1.ensureUtilsFile)(cwd, config);
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
        spinner.succeed(chalk_1.default.green('Watermelon initialized successfully.'));
        console.log(`\n${chalk_1.default.bold('Next steps')}`);
        console.log(`  ${chalk_1.default.gray('Add a component:')} ${chalk_1.default.cyan('watermelon add button')}`);
        console.log(`  ${chalk_1.default.gray('Use a namespace:')} ${chalk_1.default.cyan('watermelon add @aceternity/card')}`);
    }
    catch (error) {
        spinner.fail('Failed to initialize Watermelon');
        console.error(chalk_1.default.red(getErrorMessage(error)));
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
    .action(async (components, options) => {
    const cwd = process.cwd();
    const config = await (0, config_js_1.getConfig)(cwd);
    if (!config) {
        console.log(chalk_1.default.red('Watermelon is not initialized in this project.'));
        console.log(`${chalk_1.default.gray('Run')} ${chalk_1.default.cyan('watermelon init')} ${chalk_1.default.gray('first.')}`);
        process.exit(1);
    }
    const spinner = (0, ora_1.default)('Resolving component manifests...').start();
    try {
        const resolvedComponents = await (0, registry_js_1.collectComponents)(components, config);
        spinner.succeed(`Resolved ${resolvedComponents.length} component${resolvedComponents.length === 1 ? '' : 's'}.`);
        const dependencyNames = Array.from(new Set(resolvedComponents.flatMap((component) => component.manifest.dependencies ?? []))).sort();
        const missingDependencies = await (0, dependencies_js_1.getMissingDependencies)(dependencyNames, cwd);
        if (options.dryRun) {
            printDryRunSummary(resolvedComponents, missingDependencies, options.path);
        }
        else if (missingDependencies.length > 0) {
            await (0, dependencies_js_1.installDependencies)(missingDependencies, cwd);
        }
        const fileSpinner = (0, ora_1.default)(options.dryRun ? 'Planning file changes...' : 'Installing component files...').start();
        const plannedFiles = await (0, files_js_1.installFiles)(resolvedComponents, {
            cwd,
            config,
            installPath: options.path,
            force: options.force,
            dryRun: options.dryRun,
            downloadFile: (component, file) => (0, registry_js_1.downloadRegistryFile)(component.specifier.fileBaseUrl, file),
        });
        fileSpinner.succeed(options.dryRun
            ? `Planned ${plannedFiles.length} file change${plannedFiles.length === 1 ? '' : 's'}.`
            : `Installed ${plannedFiles.length} file${plannedFiles.length === 1 ? '' : 's'}.`);
        if (options.dryRun) {
            printDryRunFiles(plannedFiles);
            return;
        }
        console.log(`\n${chalk_1.default.bold.green('Installed components')}`);
        for (const component of resolvedComponents) {
            console.log(`  ${chalk_1.default.cyan(component.specifier.raw)}`);
        }
        if (missingDependencies.length > 0) {
            console.log(`\n${chalk_1.default.bold('Installed dependencies')}`);
            console.log(`  ${missingDependencies.join(', ')}`);
        }
    }
    catch (error) {
        spinner.fail('Failed to add components');
        console.error(chalk_1.default.red(getErrorMessage(error)));
        process.exit(1);
    }
});
program.parse();
function printDryRunSummary(components, missingDependencies, installPath) {
    console.log(`\n${chalk_1.default.bold('Dry run')}`);
    console.log(`  ${chalk_1.default.gray('Components:')} ${components.map((component) => component.specifier.raw).join(', ')}`);
    if (installPath) {
        console.log(`  ${chalk_1.default.gray('Install path:')} ${installPath}`);
    }
    if (missingDependencies.length > 0) {
        console.log(`  ${chalk_1.default.gray('Missing dependencies:')} ${missingDependencies.join(', ')}`);
    }
    else {
        console.log(`  ${chalk_1.default.gray('Missing dependencies:')} none`);
    }
}
function printDryRunFiles(plannedFiles) {
    if (plannedFiles.length === 0) {
        return;
    }
    console.log(`\n${chalk_1.default.bold('Files')}`);
    for (const file of plannedFiles) {
        const label = file.exists ? chalk_1.default.yellow('overwrite') : chalk_1.default.green('create');
        console.log(`  ${label} ${file.relativePath}`);
    }
}
function getErrorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}

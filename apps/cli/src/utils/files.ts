import fs from 'fs-extra';
import path from 'path';
import type { WatermelonConfig } from './config.js';
import type { RegistryFile, ResolvedComponent } from './registry.js';

export interface InstallFilesOptions {
    cwd: string;
    config: WatermelonConfig;
    installPath?: string;
    force?: boolean;
    dryRun?: boolean;
    downloadFile: (component: ResolvedComponent, file: RegistryFile) => Promise<string>;
}

export interface PlannedFile {
    targetPath: string;
    relativePath: string;
    exists: boolean;
}

export async function installFiles(
    components: ResolvedComponent[],
    options: InstallFilesOptions
): Promise<PlannedFile[]> {
    const plannedFiles: PlannedFile[] = [];
    const targetRoot = resolveTargetRoot(options.cwd, options.installPath);

    for (const component of components) {
        for (const file of component.manifest.files) {
            const targetPath = path.join(targetRoot, file.path);
            const exists = await fs.pathExists(targetPath);

            if (exists && !options.force) {
                throw new Error(
                    `File already exists: ${path.relative(options.cwd, targetPath)}. Re-run with --force to overwrite.`
                );
            }

            plannedFiles.push({
                targetPath,
                relativePath: path.relative(options.cwd, targetPath),
                exists,
            });

            if (options.dryRun) {
                continue;
            }

            const content = await options.downloadFile(component, file);
            const transformedContent = transformImports(content, options.config);

            await fs.ensureDir(path.dirname(targetPath));
            await fs.writeFile(targetPath, transformedContent, 'utf-8');
        }
    }

    return plannedFiles;
}

export function transformImports(content: string, config: WatermelonConfig): string {
    let transformed = content;

    transformed = transformed.replace(/@\/registry\/components/g, config.aliases.components);
    transformed = transformed.replace(/@\/registry\/lib/g, path.dirname(config.aliases.utils));

    return transformed;
}

export async function ensureUtilsFile(cwd: string, config: WatermelonConfig): Promise<void> {
    const utilsContent = `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
`;

    const utilsPath = config.aliases.utils.replace('@/', '');
    const fullPath = path.join(cwd, utilsPath + '.ts');

    if (!(await fs.pathExists(fullPath))) {
        await fs.ensureDir(path.dirname(fullPath));
        await fs.writeFile(fullPath, utilsContent, 'utf-8');
    }
}

export async function ensureComponentsDirectory(cwd: string, config: WatermelonConfig): Promise<void> {
    const componentsPath = config.aliases.components.replace('@/', '');
    await fs.ensureDir(path.join(cwd, componentsPath, 'ui'));
}

export async function ensureCssFile(cwd: string, config: WatermelonConfig): Promise<void> {
    const cssContent = `@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-geist-mono);
  --shadow-3d: inset 0 5px 6px var(--color-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
}

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.809 0.105 251.813);
  --chart-2: oklch(0.623 0.214 259.815);
  --chart-3: oklch(0.546 0.245 262.881);
  --chart-4: oklch(0.488 0.243 264.376);
  --chart-5: oklch(0.424 0.199 265.638);
  --radius: 0.625rem;
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.809 0.105 251.813);
  --chart-2: oklch(0.623 0.214 259.815);
  --chart-3: oklch(0.546 0.245 262.881);
  --chart-4: oklch(0.488 0.243 264.376);
  --chart-5: oklch(0.424 0.199 265.638);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }

@keyframes show-top-mask {
  to {
    --top-mask-height: var(--mask-height);
    }
  }

@keyframes hide-bottom-mask {
  to {
    --bottom-mask-height: 0px;
    }
  }

@keyframes show-left-mask {
  to {
    --left-mask-width: var(--mask-width);
    }
  }

@keyframes hide-right-mask {
  to {
    --right-mask-width: 0px;
    }
  }
}

@property --top-mask-height {
    syntax: "<length>";
    inherits: true;
    initial-value: 0px;
}

@property --bottom-mask-height {
    syntax: "<length>";
    inherits: true;
    initial-value: 64px;
}

@property --left-mask-width {
    syntax: "<length>";
    inherits: true;
    initial-value: 0px;
}

@property --right-mask-width {
    syntax: "<length>";
    inherits: true;
    initial-value: 64px;
}

@utility scroll-fade-effect-y {
    --mask-height: 64px;
    --mask-offset-top: 0px;
    --mask-offset-bottom: 0px;
    --scroll-buffer: 2rem;
    mask-image: linear-gradient(to top, transparent, black 90%), linear-gradient(to bottom, transparent 0%, black 100%), linear-gradient(black, black);
    mask-size: 100% var(--top-mask-height), 100% var(--bottom-mask-height), 100% 100%;
    mask-repeat: no-repeat, no-repeat, no-repeat;
    mask-position: 0 var(--mask-offset-top), 0 calc(100% - var(--mask-offset-bottom)), 0 0;
    mask-composite: exclude;
    animation-name: show-top-mask, hide-bottom-mask;
    animation-timeline: scroll(self), scroll(self);
    animation-range: 0 var(--scroll-buffer), calc(100% - var(--scroll-buffer)) 100%;
    animation-fill-mode: both;
}

@utility scroll-fade-effect-x {
    --mask-width: 64px;
    --mask-offset-left: 0px;
    --mask-offset-right: 0px;
    --scroll-buffer: 2rem;
    mask-image: linear-gradient(to left, transparent, black 90%), linear-gradient(to right, transparent 0%, black 100%), linear-gradient(black, black);
    mask-size: var(--left-mask-width) 100%, var(--right-mask-width) 100%, 100% 100%;
    mask-repeat: no-repeat, no-repeat, no-repeat;
    mask-position: var(--mask-offset-left) 0, calc(100% - var(--mask-offset-right)) 0, 0 0;
    mask-composite: exclude;
    animation-name: show-left-mask, hide-right-mask;
    animation-timeline: scroll(self inline), scroll(self inline);
    animation-range: 0 var(--scroll-buffer), calc(100% - var(--scroll-buffer)) 100%;
    animation-fill-mode: both;
}

/* Hide scrollbar globally */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Apply to all scrollable elements */
* {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

*::-webkit-scrollbar {
  display: none;
}
`;

    const fullPath = path.join(cwd, config.tailwind.css);

    if (!(await fs.pathExists(fullPath))) {
        await fs.ensureDir(path.dirname(fullPath));
        await fs.writeFile(fullPath, cssContent, 'utf-8');
    }
}

function resolveTargetRoot(cwd: string, installPath?: string): string {
    if (!installPath) {
        return cwd;
    }

    return path.isAbsolute(installPath)
        ? installPath
        : path.join(cwd, installPath);
}

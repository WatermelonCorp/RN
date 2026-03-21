import fetch from 'node-fetch';
import {
    isRegistryDirectoryEntry,
    type RegistryDirectoryEntry,
    type RegistrySource,
    type WatermelonConfig,
} from './config.js';

export interface ComponentSpecifier {
    raw: string;
    scope: string | null;
    componentName: string;
    manifestUrl: string;
    fileBaseUrl: string;
    registry: RegistrySource;
}

export interface RegistryFile {
    path: string;
    url?: string;
}

export interface ComponentManifest {
    name: string;
    dependencies?: string[];
    registryDependencies?: string[];
    files: RegistryFile[];
}

export interface ResolvedComponent {
    specifier: ComponentSpecifier;
    manifest: ComponentManifest;
}

export function parseComponentSpecifier(
    input: string,
    config: WatermelonConfig
): ComponentSpecifier {
    const trimmed = input.trim();

    if (!trimmed) {
        throw new Error('Component name cannot be empty.');
    }

    if (trimmed.startsWith('@')) {
        const parts = trimmed.split('/');
        if (parts.length !== 2 || !parts[0] || !parts[1]) {
            throw new Error(
                `Invalid component specifier "${input}". Use "button" or "@scope/component".`
            );
        }

        const scope = parts[0];
        const registryUrl = resolveRegistry(scope, config);

        return {
            raw: trimmed,
            scope,
            componentName: parts[1],
            manifestUrl: buildManifestUrl(registryUrl, parts[1]),
            fileBaseUrl: buildFileBaseUrl(registryUrl),
            registry: config.registries[scope],
        };
    }

    return {
        raw: trimmed,
        scope: null,
        componentName: trimmed,
        manifestUrl: buildManifestUrl(config.defaultRegistry, trimmed),
        fileBaseUrl: buildFileBaseUrl(config.defaultRegistry),
        registry: config.defaultRegistry,
    };
}

export function resolveRegistry(scope: string, config: WatermelonConfig): string {
    const registryUrl = config.registries[scope];

    if (!registryUrl) {
        throw new Error(
            `Unknown registry scope "${scope}". Add it to "registries" in watermelon.json.`
        );
    }

    return getRegistryTemplate(registryUrl);
}

export async function fetchComponent(
    specifier: ComponentSpecifier
): Promise<ComponentManifest> {
    const manifestUrl = specifier.manifestUrl;

    let response;
    try {
        response = await fetch(manifestUrl);
    } catch (error) {
        throw new Error(
            `Network error while fetching "${specifier.raw}" from ${manifestUrl}: ${getErrorMessage(error)}`
        );
    }

    if (response.status === 404) {
        throw new Error(
            `Component "${specifier.raw}" was not found at ${manifestUrl}.`
        );
    }

    if (!response.ok) {
        throw new Error(
            `Failed to fetch "${specifier.raw}" from ${manifestUrl}: ${response.status} ${response.statusText}`
        );
    }

    let data: unknown;
    try {
        data = await response.json();
    } catch (error) {
        throw new Error(
            `Invalid JSON received for "${specifier.raw}" from ${manifestUrl}: ${getErrorMessage(error)}`
        );
    }

    return validateManifest(data, specifier.raw);
}

export async function collectComponents(
    inputs: string[],
    config: WatermelonConfig
): Promise<ResolvedComponent[]> {
    const resolved = new Map<string, ResolvedComponent>();

    async function visit(input: string, parentScope: string | null): Promise<void> {
        const nextInput = parentScope && !input.startsWith('@')
            ? `${parentScope}/${input}`
            : input;
        const specifier = parseComponentSpecifier(nextInput, config);
        const key = specifier.raw;

        if (resolved.has(key)) {
            return;
        }

        const manifest = await fetchComponent(specifier);
        resolved.set(key, { specifier, manifest });

        for (const dependency of manifest.registryDependencies ?? []) {
            await visit(dependency, specifier.scope);
        }
    }

    for (const input of inputs) {
        await visit(input, null);
    }

    return Array.from(resolved.values());
}

export async function downloadRegistryFile(
    fileBaseUrl: string,
    file: RegistryFile
): Promise<string> {
    const sourceUrl = file.url ?? buildFileUrl(fileBaseUrl, file.path);

    let response;
    try {
        response = await fetch(sourceUrl);
    } catch (error) {
        throw new Error(
            `Network error while downloading "${file.path}" from ${sourceUrl}: ${getErrorMessage(error)}`
        );
    }

    if (!response.ok) {
        throw new Error(
            `Failed to download "${file.path}" from ${sourceUrl}: ${response.status} ${response.statusText}`
        );
    }

    return response.text();
}

function buildManifestUrl(registrySource: RegistrySource | string, componentName: string): string {
    const template = typeof registrySource === 'string'
        ? registrySource
        : getRegistryTemplate(registrySource);

    if (template.includes('{name}')) {
        return template.replaceAll('{name}', encodeURIComponent(componentName));
    }

    return `${normalizeRegistryUrl(template)}/${encodeURIComponent(componentName)}.json`;
}

function buildFileUrl(fileBaseUrl: string, filePath: string): string {
    const normalizedPath = filePath
        .replace(/^\/+/, '')
        .split('/')
        .map(encodeURIComponent)
        .join('/');

    return `${normalizeRegistryUrl(fileBaseUrl)}/files/${normalizedPath}`;
}

function buildFileBaseUrl(registrySource: RegistrySource | string): string {
    const template = typeof registrySource === 'string'
        ? registrySource
        : getRegistryTemplate(registrySource);

    const normalized = normalizeRegistryUrl(template);

    if (!normalized.includes('{name}')) {
        return normalized;
    }

    const withoutPlaceholder = normalized.replace(/\/?\{name\}\.json$/, '');
    const withoutRegistrySegment = withoutPlaceholder.replace(/\/r$/, '');

    return withoutRegistrySegment;
}

function normalizeRegistryUrl(registryUrl: string): string {
    return registryUrl.replace(/\/+$/, '');
}

function getRegistryTemplate(registry: RegistrySource | RegistryDirectoryEntry): string {
    return isRegistryDirectoryEntry(registry) ? registry.url : registry;
}

function validateManifest(data: unknown, name: string): ComponentManifest {
    if (!data || typeof data !== 'object') {
        throw new Error(`Registry manifest for "${name}" must be an object.`);
    }

    const manifest = data as Partial<ComponentManifest>;

    if (typeof manifest.name !== 'string' || manifest.name.length === 0) {
        throw new Error(`Registry manifest for "${name}" is missing a valid "name".`);
    }

    if (!Array.isArray(manifest.files) || manifest.files.length === 0) {
        throw new Error(`Registry manifest for "${name}" must include at least one file.`);
    }

    for (const file of manifest.files) {
        if (!file || typeof file !== 'object' || typeof file.path !== 'string') {
            throw new Error(`Registry manifest for "${name}" contains an invalid file entry.`);
        }

        if (file.url !== undefined && typeof file.url !== 'string') {
            throw new Error(`Registry manifest for "${name}" contains an invalid file URL.`);
        }
    }

    for (const field of ['dependencies', 'registryDependencies'] as const) {
        const value = manifest[field];
        if (value !== undefined && (!Array.isArray(value) || value.some((item) => typeof item !== 'string'))) {
            throw new Error(`Registry manifest for "${name}" has an invalid "${field}" field.`);
        }
    }

    return {
        name: manifest.name,
        files: manifest.files,
        dependencies: manifest.dependencies ?? [],
        registryDependencies: manifest.registryDependencies ?? [],
    };
}

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

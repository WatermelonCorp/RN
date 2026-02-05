import fetch from 'node-fetch';
import { REGISTRY_URL } from './config.js';

export interface RegistryItem {
    name: string;
    type: string;
    files: Array<{
        path: string;
        content: string;
        type: string;
    }>;
    dependencies?: string[];
    registryDependencies?: string[];
    tailwind?: {
        config: Record<string, any>;
    };
}

export interface Registry {
    components: Record<string, RegistryItem>;
}

export async function fetchRegistry(): Promise<Registry> {
    try {
        const response = await fetch(`${REGISTRY_URL}/registry.json`);
        if (!response.ok) {
            throw new Error(`Failed to fetch registry: ${response.statusText}`);
        }
        return await response.json() as Registry;
    } catch (error) {
        throw new Error(`Failed to fetch registry: ${error}`);
    }
}

export async function fetchComponentFile(componentPath: string): Promise<string> {
    try {
        // Fetch the actual component file from GitHub
        const url = `${REGISTRY_URL}/src/${componentPath}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch component file: ${response.statusText}`);
        }

        return await response.text();
    } catch (error) {
        throw new Error(`Failed to fetch component file: ${error}`);
    }
}

export async function getComponentInfo(name: string): Promise<RegistryItem | null> {
    const registry = await fetchRegistry();
    return registry.components[name] || null;
}

export function getAllComponentDependencies(
    componentName: string,
    registry: Registry,
    visited = new Set<string>()
): RegistryItem[] {
    if (visited.has(componentName)) {
        return [];
    }

    visited.add(componentName);
    const component = registry.components[componentName];

    if (!component) {
        return [];
    }

    const dependencies: RegistryItem[] = [component];

    if (component.registryDependencies) {
        for (const dep of component.registryDependencies) {
            dependencies.push(
                ...getAllComponentDependencies(dep, registry, visited)
            );
        }
    }

    return dependencies;
}

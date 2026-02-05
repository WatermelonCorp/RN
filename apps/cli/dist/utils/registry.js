"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchRegistry = fetchRegistry;
exports.fetchComponentFile = fetchComponentFile;
exports.getComponentInfo = getComponentInfo;
exports.getAllComponentDependencies = getAllComponentDependencies;
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_js_1 = require("./config.js");
async function fetchRegistry() {
    try {
        const response = await (0, node_fetch_1.default)(`${config_js_1.REGISTRY_URL}/registry.json`);
        if (!response.ok) {
            throw new Error(`Failed to fetch registry: ${response.statusText}`);
        }
        return await response.json();
    }
    catch (error) {
        throw new Error(`Failed to fetch registry: ${error}`);
    }
}
async function fetchComponentFile(componentPath) {
    try {
        // Fetch the actual component file from GitHub
        const url = `${config_js_1.REGISTRY_URL}/src/${componentPath}`;
        const response = await (0, node_fetch_1.default)(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch component file: ${response.statusText}`);
        }
        return await response.text();
    }
    catch (error) {
        throw new Error(`Failed to fetch component file: ${error}`);
    }
}
async function getComponentInfo(name) {
    const registry = await fetchRegistry();
    return registry.components[name] || null;
}
function getAllComponentDependencies(componentName, registry, visited = new Set()) {
    if (visited.has(componentName)) {
        return [];
    }
    visited.add(componentName);
    const component = registry.components[componentName];
    if (!component) {
        return [];
    }
    const dependencies = [component];
    if (component.registryDependencies) {
        for (const dep of component.registryDependencies) {
            dependencies.push(...getAllComponentDependencies(dep, registry, visited));
        }
    }
    return dependencies;
}

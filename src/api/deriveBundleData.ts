import { BundleData, ModuleGraph, ModuleGraphNode } from '../types/BundleData';
import { Stats, Module, Reason } from '../types/Stats';

type ModuleNameMap = Map<string | number, string>;

export function deriveBundleData(stats: Stats): BundleData {
    return {
        graph: generateGraph(stats),
    };
}

function generateGraph(stats: Stats): ModuleGraph {
    const moduleNameMap = createModuleNameMap(stats);
    let graph: ModuleGraph = {};

    for (let module of stats.modules) {
        processModule(module, graph, moduleNameMap);
    }

    return graph;
}

export function processModule(module: Module, graph: ModuleGraph, moduleNameMap: ModuleNameMap) {
    // Modules marked as ignored don't get bundled, so we can ignore them too
    if (module.identifier.startsWith('ignored ')) {
        console.log(`Ignoring module '${module.identifier}'`);
        return;
    }

    if (!module.modules) {
        // This is just an individual module, so we can add it to the graph as-is
        addModuleToGraph(graph, {
            name: module.name,
            parents: getParents(module.reasons, moduleNameMap),
            chunks: module.chunks,
            size: module.size,
        });
    } else {
        // The module is the amalgamation of multiple scope hoisted modules, so we add each of
        // them individually.

        // The first hoisted module acts as the primary module
        const primaryModule = module.modules[0];
        addModuleToGraph(graph, {
            name: primaryModule.name,
            parents: getParents(module.reasons, moduleNameMap),
            containsHoistedModules: true,
            chunks: module.chunks,
            size: primaryModule.size,
        });

        // Other hoisted modules are parented to the primary module
        for (let i = 1; i < module.modules.length; i++) {
            const hoistedModule = module.modules[i];
            addModuleToGraph(graph, {
                name: hoistedModule.name,
                parents: [primaryModule.name],
                chunks: module.chunks,
                size: hoistedModule.size,
            });
        }
    }
}

export function getParents(reasons: Reason[], moduleNameMap: ModuleNameMap) {
    // Start with the module ID for each reason
    let moduleIds = reasons.map(r => r.moduleId);

    // Filter out nulls (this happens for entry point modules)
    moduleIds = moduleIds.filter(p => p != null);

    // Filter out duplicates (this happens due to scope hoisting)
    moduleIds = [...new Set(moduleIds)];

    // Map module IDs to module names
    return moduleIds.map(moduleId => moduleNameMap.get(moduleId));
}

function addModuleToGraph(graph: ModuleGraph, moduleNode: ModuleGraphNode) {
    if (graph[moduleNode.name]) {
        throw new Error(`Module already exists in graph: ${moduleNode.name}`);
    }

    graph[moduleNode.name] = moduleNode;
}

function createModuleNameMap(stats: Stats) {
    const moduleNameMap: ModuleNameMap = new Map();

    for (let module of stats.modules) {
        // If the module contains multiple hoisted modules, the first one is the primary module
        let name = module.modules ? module.modules[0].name : module.name;
        moduleNameMap.set(module.id, name);
    }

    return moduleNameMap;
}

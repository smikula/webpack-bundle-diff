import { BundleData, ModuleGraph } from '../types/BundleData';
import { Stats, Module } from '../types/Stats';

export function deriveBundleData(stats: Stats): BundleData {
    return {
        graph: generateGraph(stats),
    };
}

function generateGraph(stats: Stats): ModuleGraph {
    let graph: ModuleGraph = {};
    for (let m of stats.modules) {
        addPrimaryModuleToGraph(m, graph);
    }

    return graph;
}

export function addPrimaryModuleToGraph(primaryModule: Module, graph: ModuleGraph) {
    // Ensure there are no duplicate entries
    if (graph[primaryModule.id]) {
        throw new Error(`Module already exists in graph: ${primaryModule.id}`);
    }

    // Add the node for the primary module
    graph[primaryModule.id] = {
        parents: primaryModule.reasons.map(r => r.moduleId),
        containsHoistedModules: !!primaryModule.modules,
        chunks: primaryModule.chunks,
        size: primaryModule.size,
    };

    // Add entries for modules that have been hoisted into this module, if any
    if (primaryModule.modules) {
        addHoistedModulesToGraph(primaryModule, graph);
    }
}

export function addHoistedModulesToGraph(primaryModule: Module, graph: ModuleGraph) {
    for (let hoistedModule of primaryModule.modules) {
        // The primary module is already accounted for, so don't treat it as a hoisted module
        if (hoistedModule.name == primaryModule.id) {
            // The original size included all the hoisted modules, so update it to just be the single module
            graph[primaryModule.id].size = hoistedModule.size;
        } else {
            // Scope-hoisted modules don't have an ID, but the name is functionally equivalent here
            let submoduleId = hoistedModule.name;

            // Assert that there are no duplicate entries
            if (graph[submoduleId]) {
                throw new Error(`Module already exists in graph: ${submoduleId} (hoisted)`);
            }

            // Add the node for the submodule
            graph[submoduleId] = {
                parents: [primaryModule.id],
                chunks: primaryModule.chunks,
                size: hoistedModule.size,
            };
        }
    }
}

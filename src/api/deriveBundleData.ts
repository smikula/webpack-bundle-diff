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
        addModuleToGraph(m, graph);
    }

    return graph;
}

export function addModuleToGraph(newModule: Module, graph: ModuleGraph) {
    // Ensure there are no duplicate entries
    if (graph[newModule.id]) {
        throw new Error(`Module already exists in graph: ${newModule.id}`);
    }

    // Add the node for the primary module
    graph[newModule.id] = {
        parents: newModule.reasons.map(r => r.moduleId),
        containsHoistedModules: !!newModule.modules,
        chunks: newModule.chunks,
        size: newModule.size,
    };

    // Add entries for submodules if  any
    if (newModule.modules) {
        newModule.modules.forEach(m2 => {
            // The primary module is already accounted for, so don't treat it as a submodule
            if (m2.name == newModule.id) {
                // The original size included all the hoisted modules, so update it to just be the single module
                graph[newModule.id].size = m2.size;
                return;
            }

            // Scope-hoisted modules don't have an ID, but the name is functionally equivalent here
            let submoduleId = m2.name;

            // Assert that there are no duplicate entries
            if (graph[submoduleId]) {
                throw new Error(`Module already exists in graph: ${submoduleId} (hoisted)`);
            }

            // Add the node for the submodule
            graph[submoduleId] = {
                parents: [newModule.id],
                isHoisted: true,
                chunks: newModule.chunks,
                size: newModule.size,
            };
        });
    }
}

import { BundleData, ModuleGraph } from '../types/BundleData';
import { Stats } from '../types/Stats';

export function deriveBundleData(stats: Stats): BundleData {
    return {
        graph: generateGraph(stats),
    };
}

function generateGraph(stats: Stats): ModuleGraph {
    let graph: ModuleGraph = {};

    stats.modules.forEach(m => {
        // Ensure there are no duplicate entries
        if (graph[m.id]) {
            throw new Error(`Module already exists in graph: ${m.id}`);
        }

        // Add the node for the primary module
        graph[m.id] = {
            parents: m.reasons.map(r => r.moduleId),
            containsHoistedModules: !!m.modules,
            chunks: m.chunks,
            size: m.size,
        };

        // Add entries for submodules if  any
        if (m.modules) {
            m.modules.forEach(m2 => {
                // The primary module is already accounted for, so don't treat it as a submodule
                if (m2.name == m.id) {
                    // The original size included all the hoisted modules, so update it to just be the single module
                    graph[m.id].size = m2.size;
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
                    parents: [m.id],
                    isHoisted: true,
                    chunks: m.chunks,
                    size: m.size,
                };
            });
        }
    });

    return graph;
}

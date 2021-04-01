import { ModuleGraph, ModuleGraphNode } from '../../../types/BundleData';
import { Stats, Module } from '../../../types/Stats';
import { arrayUnion } from '../../../util/arrayUnion';
import NamedChunkGroupLookupMap from '../NamedChunkGroupLookupMap';
import { validateGraph } from './validateGraph';
import { processReasons } from './processReasons';

export function deriveGraph(stats: Stats, validate?: boolean): ModuleGraph {
    const ncgLookup = new NamedChunkGroupLookupMap(stats);

    let graph: ModuleGraph = {};

    for (let module of stats.modules) {
        processModule(module, graph, ncgLookup);
    }

    debugger;

    if (validate) {
        validateGraph(graph);
    }

    return graph;
}

export function processModule(
    module: Module,
    graph: ModuleGraph,
    ncgLookup: NamedChunkGroupLookupMap
) {
    // Modules marked as ignored don't get bundled, so we can ignore them too
    if (module.identifier.startsWith('ignored ')) {
        return;
    }

    // Precalculate named chunk groups since they are the same for all submodules
    const namedChunkGroups = ncgLookup.getNamedChunkGroups(module.chunks);

    if (!module.modules) {
        // This is just an individual module, so we can add it to the graph as-is
        addModuleToGraph(graph, {
            name: module.name,
            namedChunkGroups,
            size: module.size,
            ...processReasons(module.reasons),
        });
    } else {
        // The module is the amalgamation of multiple scope hoisted modules, so we add each of
        // them individually.

        // The first hoisted module inherits its reasons from the primary module
        const firstModule = module.modules[0];
        addModuleToGraph(graph, {
            name: firstModule.name,
            namedChunkGroups,
            size: firstModule.size,
            ...processReasons(module.reasons),
        });

        // Other submodules have their own reasons
        //
        // Note: it looks like some submodules don't have any reasons.  It appears that this
        // happens with modules that get optimized out of the final graph; e.g. an index that just
        // re-exports stuff from other modules.
        //
        for (let i = 1; i < module.modules.length; i++) {
            const submodule = module.modules[i];

            addModuleToGraph(graph, {
                name: submodule.name,
                namedChunkGroups,
                size: submodule.size,
                ...processReasons(submodule.reasons),
            });
        }
    }
}

function addModuleToGraph(graph: ModuleGraph, moduleNode: ModuleGraphNode) {
    if (graph[moduleNode.name]) {
        const graphNode = graph[moduleNode.name];
        graphNode.parents = arrayUnion(graphNode.parents, moduleNode.parents);
        graphNode.namedChunkGroups = arrayUnion(
            graphNode.namedChunkGroups,
            moduleNode.namedChunkGroups
        );
    } else {
        graph[moduleNode.name] = moduleNode;
    }
}

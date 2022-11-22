import { ModuleGraph, ModuleGraphNode } from '../../../types/BundleData';
import { Reason, Stats } from '../../../types/Stats';
import { arrayUnion } from '../../../util/arrayUnion';
import ModuleIdToNameMap from './ModuleIdToNameMap';
import NamedChunkGroupLookupMap from '../NamedChunkGroupLookupMap';
import { validateGraph } from './validateGraph';
import { processReasons } from './processReasons';
import { Compilation, StatsModule, Module } from 'webpack';
import { getModuleName } from '../../../util/getModuleName';
import { isModule } from '../../../util/typeGuards';

export function deriveGraph(stats: Stats | Compilation, validate?: boolean): ModuleGraph {
    const moduleIdToNameMap = new ModuleIdToNameMap(stats);
    const ncgLookup = new NamedChunkGroupLookupMap(stats);

    let graph: ModuleGraph = {};

    for (let module of stats.modules) {
        processModule(module, graph, moduleIdToNameMap, ncgLookup, stats);
    }

    if (validate) {
        validateGraph(graph);
    }

    return graph;
}

export function processModule(
    uncastModule: Module | StatsModule,
    graph: ModuleGraph,
    moduleIdToNameMap: ModuleIdToNameMap,
    ncgLookup: NamedChunkGroupLookupMap,
    compilationOrStats: Compilation | Stats
): void {
    const module = uncastModule as StatsModule | (Module & { modules?: Module[] });
    const moduleIdentifier = !isModule(module) ? module.identifier : module.identifier?.();
    // Modules marked as ignored don't get bundled, so we can ignore them too
    if (moduleIdentifier?.startsWith('ignored ')) {
        return;
    }

    const compilation = compilationOrStats as Compilation;
    const moduleReasons: Pick<Reason, 'moduleName' | 'moduleId' | 'type'>[] = isModule(module)
        ? [...compilation.moduleGraph.getIncomingConnections(module as Module)]
              .filter(({ dependency }) => !!dependency)
              .map(({ dependency }) => {
                  const parentModule = compilation.moduleGraph.getParentModule(dependency);
                  return {
                      moduleName: parentModule && getModuleName(parentModule, compilation),
                      moduleId: parentModule && compilation.chunkGraph.getModuleId(parentModule),
                      type: dependency.type,
                  };
              })
        : module.reasons;

    // Precalculate named chunk groups since they are the same for all submodules
    const moduleChunks: (string | number | null)[] = isModule(module)
        ? compilation.chunkGraph.getModuleChunks(module as Module).map(chunk => chunk.id)
        : module.chunks;
    const namedChunkGroups = ncgLookup.getNamedChunkGroups(moduleChunks);

    if (!module.modules) {
        const moduleName = getModuleName(module, compilationOrStats);
        const moduleSize = !isModule(module) ? module.size : module.size();
        // This is just an individual module, so we can add it to the graph as-is
        addModuleToGraph(graph, {
            name: moduleName,
            namedChunkGroups,
            size: moduleSize,
            ...processReasons(moduleReasons, moduleIdToNameMap),
        });
    } else {
        // The module is the amalgamation of multiple scope hoisted modules, so we add each of
        // them individually.
        const moduleSize = !isModule(module.modules[0])
            ? module.modules[0].size
            : module.modules[0].size();

        const moduleName = getModuleName(module.modules[0], compilationOrStats);

        // Assume the first hoisted module acts as the primary module
        addModuleToGraph(graph, {
            name: moduleName,
            containsHoistedModules: true,
            namedChunkGroups,
            size: moduleSize,
            ...processReasons(moduleReasons, moduleIdToNameMap),
        });

        // Other hoisted modules are parented to the primary module
        for (let i = 1; i < module.modules.length; i++) {
            const hoistedModule = module.modules[i];
            const hoistedModuleName = getModuleName(hoistedModule, compilationOrStats);
            const hoistedModuleSize = !isModule(hoistedModule)
                ? hoistedModule.size
                : hoistedModule.size();
            addModuleToGraph(graph, {
                name: hoistedModuleName,
                parents: [moduleName],
                directParents: [moduleName],
                lazyParents: [],
                namedChunkGroups,
                size: hoistedModuleSize,
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

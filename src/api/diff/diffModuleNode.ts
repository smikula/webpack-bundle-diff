import { ModuleGraphNode } from '../../types/BundleData';
import { DiffResults } from '../../types/DiffResults';
import handleAddedModule from './handleAddedModule';
import handleChangedModule from './handleChangedModule';
import handleRemovedModule from './handleRemovedModule';
import { EnhancedModuleGraph } from './EnhancedModuleGraph';

export default function diffModuleNode(
    baselineGraph: EnhancedModuleGraph,
    comparisonGraph: EnhancedModuleGraph,
    moduleName: string,
    results: DiffResults
) {
    const baselineModule = baselineGraph.getModule(moduleName);
    const comparisonModule = comparisonGraph.getModule(moduleName);
    const baselineChunkGroups = getNamedChunkGroups(baselineModule);
    const comparisonChunkGroups = getNamedChunkGroups(comparisonModule);
    const allChunkGroups = new Set([...baselineChunkGroups, ...comparisonChunkGroups]);

    // Check whether this module was added, removed, or changed within each chunk group
    for (let chunkGroupName of allChunkGroups) {
        let chunkGroupDiff = results[chunkGroupName];
        if (!baselineChunkGroups.has(chunkGroupName)) {
            handleAddedModule(
                moduleName,
                baselineGraph,
                comparisonGraph,
                comparisonModule,
                chunkGroupName,
                chunkGroupDiff
            );
        } else if (!comparisonChunkGroups.has(chunkGroupName)) {
            handleRemovedModule(
                moduleName,
                baselineGraph,
                comparisonGraph,
                baselineModule,
                chunkGroupName,
                chunkGroupDiff
            );
        } else {
            handleChangedModule(moduleName, baselineModule, comparisonModule, chunkGroupDiff);
        }
    }
}

// Get the set of named chunk groups for a module, accounting for null
function getNamedChunkGroups(module: ModuleGraphNode) {
    return new Set((module && module.namedChunkGroups) || []);
}

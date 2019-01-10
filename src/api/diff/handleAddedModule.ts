import { ModuleGraph, ModuleGraphNode } from '../../types/BundleData';
import { ChunkGroupDiff } from '../../types/DiffResults';
import filterToChunkGroup from './filterToChunkGroup';

export default function handleAddedModule(
    moduleName: string,
    baselineGraph: ModuleGraph,
    comparisonGraph: ModuleGraph,
    comparisonModule: ModuleGraphNode,
    chunkGroupName: string,
    chunkGroupDiff: ChunkGroupDiff
) {
    // The general idea here is to only report modules whose import was explicitly added (but not
    // all the downstream dependencies of those modules).  So, if some parent of an added module
    // was in the chunk group before, then we'll report it.  If all the parents were also added,
    // then we don't need to report it.

    // Get all parents in same chunk group
    const comparisonParents = filterToChunkGroup(
        comparisonModule.parents,
        chunkGroupName,
        comparisonGraph
    );

    if (!comparisonParents.length) {
        // The added module has no parents in this chunk group; it must be a new entry point
        chunkGroupDiff.added.push({
            module: moduleName,
            parents: [],
        });
    } else {
        // We're only interested in parents that were previously in this chunk group
        const previouslyExistingParents = comparisonParents.filter(
            p => baselineGraph[p] && baselineGraph[p].namedChunkGroups.indexOf(chunkGroupName) >= 0
        );

        // Only report this addition if it was imported from some module that was previously in the chunk group
        if (previouslyExistingParents.length) {
            chunkGroupDiff.added.push({
                module: moduleName,
                parents: previouslyExistingParents,
            });
        }
    }
}

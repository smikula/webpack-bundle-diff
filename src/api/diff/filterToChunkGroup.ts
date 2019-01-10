import { ModuleGraph } from '../../types/BundleData';

// Filter a list of modules to those that exist in the given chunk group
export default function filterToChunkGroup(
    modules: string[],
    chunkGroupName: string,
    graph: ModuleGraph
) {
    return modules.filter(m => graph[m].namedChunkGroups.indexOf(chunkGroupName) >= 0);
}

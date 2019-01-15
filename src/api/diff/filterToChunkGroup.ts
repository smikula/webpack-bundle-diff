import { EnhancedModuleGraph } from './EnhancedModuleGraph';

// Filter a list of modules to those that exist in the given chunk group
export default function filterToChunkGroup(
    modules: string[],
    chunkGroupName: string,
    graph: EnhancedModuleGraph
) {
    return modules.filter(m => graph.hasModule(m, chunkGroupName));
}

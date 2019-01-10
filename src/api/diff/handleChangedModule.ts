import { ModuleGraphNode } from '../../types/BundleData';
import { ChunkGroupDiff } from '../../types/DiffResults';

export default function handleChangedModule(
    moduleName: string,
    baselineModule: ModuleGraphNode,
    comparisonModule: ModuleGraphNode,
    chunkGroupDiff: ChunkGroupDiff
) {
    // Only record non-zero deltas
    const delta = comparisonModule.size - baselineModule.size;
    if (delta) {
        chunkGroupDiff.changed.push({
            module: moduleName,
            delta,
        });
    }
}

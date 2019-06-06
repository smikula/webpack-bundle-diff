import { BundleData } from '../../types/BundleData';
import { Stats } from '../../types/Stats';
import { deriveGraph } from './deriveGraph';
import { deriveChunkGroupData } from './deriveChunkGroupData';
import { DataOptions } from '../../types/DataOptions';

export function deriveBundleData(stats: Stats, options?: DataOptions): BundleData {
    return {
        graph: deriveGraph(stats),
        chunkGroups: deriveChunkGroupData(stats, options),
    };
}

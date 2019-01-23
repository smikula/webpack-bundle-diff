import { BundleData } from '../../types/BundleData';
import { Stats } from '../../types/Stats';
import { deriveGraph } from './deriveGraph';
import { deriveChunkGroupData } from './deriveChunkGroupData';

export function deriveBundleData(stats: Stats): BundleData {
    return {
        graph: deriveGraph(stats),
        chunkGroups: deriveChunkGroupData(stats),
    };
}

import { BundleData } from '../../types/BundleData';
import { RawStats } from '../../types/Stats';
import { deriveGraph } from './graph/deriveGraph';
import { deriveChunkGroupData } from './deriveChunkGroupData';
import { DataOptions } from '../../types/DataOptions';
import { getStatsFromRawStats } from './getStatsFromRawStats';

export function deriveBundleData(rawStats: RawStats, options?: DataOptions): BundleData {
    // TODO: update readme
    // TODO: tests
    const stats = getStatsFromRawStats(rawStats, options?.childConfig);

    return {
        graph: deriveGraph(stats, options?.validate),
        chunkGroups: deriveChunkGroupData(stats, options),
    };
}

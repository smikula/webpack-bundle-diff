import { BundleData } from '../../types/BundleData';
import { RawStats } from '../../types/Stats';
import { deriveGraph } from './graph/deriveGraph';
import { deriveChunkGroupData } from './deriveChunkGroupData';
import { DataOptions } from '../../types/DataOptions';
import { getStatsFromRawStats } from './getStatsFromRawStats';
import { MultiStats, Stats } from 'webpack';

export function deriveBundleData(
    rawStats: RawStats | Stats | MultiStats,
    options?: DataOptions
): BundleData {
    const stats = getStatsFromRawStats(rawStats, options?.childStats);

    return {
        graph: deriveGraph(stats, options?.validate),
        chunkGroups: deriveChunkGroupData(stats, options),
    };
}

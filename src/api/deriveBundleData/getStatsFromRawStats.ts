import { Stats as SingleCompilationStats } from '../../types/Stats';
import { Compilation, MultiStats, Stats, StatsCompilation } from 'webpack';

export function getStatsFromRawStats(
    rawStats: StatsCompilation | Stats | MultiStats,
    childStats: string | number | undefined
): SingleCompilationStats | Compilation {
    if ('children' in rawStats || rawStats instanceof MultiStats) {
        // Make sure we are given a childStats option
        if (!childStats) {
            throw new Error('Multiple configs in build; childStats must be specified.');
        }

        // First, try to look up childStats by name
        if (typeof childStats === 'string') {
            const stats =
                rawStats instanceof MultiStats
                    ? rawStats.stats.find(({ compilation: { name } }) => name === childStats)
                    : rawStats.children.find(s => s.name === childStats);
            if (stats) {
                return stats instanceof Stats
                    ? stats.compilation
                    : (stats as SingleCompilationStats);
            }
        }

        // Try to treat childStats as a numerical index
        const index = typeof childStats === 'number' ? childStats : parseInt(childStats);
        if (!isNaN(index)) {
            const stats =
                rawStats instanceof MultiStats
                    ? rawStats.stats[index].compilation
                    : rawStats.children[index];
            if (stats) {
                return stats instanceof Stats
                    ? stats.compilation
                    : (stats as SingleCompilationStats);
            }
        }

        throw new Error(`Invalid childStats value: ${childStats}`);
    } else if (rawStats instanceof Stats) {
        return rawStats.compilation;
    } else {
        return rawStats as SingleCompilationStats;
    }
}

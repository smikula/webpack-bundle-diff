import { Stats as SingleCompilationStats } from '../../types/Stats';
import { Compilation, MultiStats, Stats, StatsCompilation } from 'webpack';

export function getStatsFromRawStats(
    rawStats: StatsCompilation | Stats | MultiStats,
    childStats: string | number | undefined
): SingleCompilationStats | Compilation {
    if ('children' in rawStats || 'stats' in rawStats) {
        // Make sure we are given a childStats option
        if (!childStats) {
            throw new Error('Multiple configs in build; childStats must be specified.');
        }

        // First, try to look up childStats by name
        if (typeof childStats === 'string') {
            const stats =
                'children' in rawStats
                    ? rawStats.children.find(s => s.name === childStats)
                    : (rawStats as MultiStats).stats.find(
                          ({ compilation: { name } }) => name === childStats
                      );
            if (stats) {
                return 'compilation' in stats ? stats.compilation : stats;
            }
        }

        // Try to treat childStats as a numerical index
        const index = typeof childStats === 'number' ? childStats : parseInt(childStats);
        if (!isNaN(index)) {
            const stats =
                'children' in rawStats
                    ? rawStats.children[index]
                    : rawStats.stats[index].compilation;
            if (stats) {
                return 'compilation' in stats ? stats.compilation : stats;
            }
        }

        throw new Error(`Invalid childStats value: ${childStats}`);
    } else if ('compilation' in rawStats) {
        return rawStats.compilation;
    } else {
        return rawStats as SingleCompilationStats;
    }
}

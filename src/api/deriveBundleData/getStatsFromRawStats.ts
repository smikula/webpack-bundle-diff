import { Stats as SingleCompilationStats } from '../../types/Stats';
import { Compilation, MultiStats, Stats, StatsCompilation } from 'webpack';
import { isMultiStats, isStats, isStatsCompilation } from '../../util/typeGuards';

export function getStatsFromRawStats(
    rawStats: StatsCompilation | Stats | MultiStats,
    childStats: string | number | undefined
): SingleCompilationStats | Compilation {
    if (isStatsCompilation(rawStats) || isMultiStats(rawStats)) {
        // Make sure we are given a childStats option
        if (!childStats) {
            throw new Error('Multiple configs in build; childStats must be specified.');
        }

        // First, try to look up childStats by name
        if (typeof childStats === 'string') {
            const stats = isStatsCompilation(rawStats)
                ? rawStats.children.find(s => s.name === childStats)
                : (rawStats as MultiStats).stats.find(
                      ({ compilation: { name } }) => name === childStats
                  );
            if (stats) {
                return isStats(stats) ? stats.compilation : (stats as SingleCompilationStats);
            }
        }

        // Try to treat childStats as a numerical index
        const index = typeof childStats === 'number' ? childStats : parseInt(childStats);
        if (!isNaN(index)) {
            const stats = isStatsCompilation(rawStats)
                ? rawStats.children[index]
                : rawStats.stats[index].compilation;
            if (stats) {
                return isStats(stats) ? stats.compilation : (stats as SingleCompilationStats);
            }
        }

        throw new Error(`Invalid childStats value: ${childStats}`);
    } else if (isStats(rawStats)) {
        return rawStats.compilation;
    } else {
        return rawStats as SingleCompilationStats;
    }
}

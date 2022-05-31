import { MultiStats, RawStats, Stats } from '../../types/Stats';

export function getStatsFromRawStats(
    rawStats: RawStats,
    childStats: string | number | undefined
): Stats {
    const multiStats = rawStats as MultiStats;
    if (multiStats.children) {
        // Make sure we are given a childStats option
        if (!childStats) {
            throw new Error('Multiple configs in build; childStats must be specified.');
        }

        // First, try to look up childStats by name
        if (typeof childStats === 'string') {
            const stats = multiStats.children.find(s => s.name === childStats);
            if (stats) {
                return stats;
            }
        }

        // Try to treat childStats as a numerical index
        const index = typeof childStats === 'number' ? childStats : parseInt(childStats);
        if (!isNaN(index)) {
            const stats = multiStats.children[index];
            if (stats) {
                return stats;
            }
        }

        throw new Error(`Invalid childStats value: ${childStats}`);
    } else {
        return rawStats as Stats;
    }
}

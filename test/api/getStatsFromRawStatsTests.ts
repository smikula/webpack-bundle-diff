import { getStatsFromRawStats } from '../../src/api/deriveBundleData/getStatsFromRawStats';
import { MultiStats, Stats } from '../../src/types/Stats';

describe('getStatsFromRawStats', () => {
    const stats1 = { name: 'stats1' } as Stats;
    const stats2 = { name: 'stats2' } as Stats;
    const multiStats = { children: [stats1, stats2] } as MultiStats;

    it('if passed a single stats object, just returns it', () => {
        // Act
        const result = getStatsFromRawStats(stats1, undefined);

        // Assert
        expect(result).toBe(stats1);
    });

    it('throws if multiple stats and childStats not specified', () => {
        // Act / Assert
        expect(() => {
            getStatsFromRawStats(multiStats, undefined);
        }).toThrow();
    });

    it('returns child stats by name', () => {
        // Act
        const result = getStatsFromRawStats(multiStats, 'stats2');

        // Assert
        expect(result).toBe(stats2);
    });

    it('throws if unable to find child stats by name', () => {
        // Act / Assert
        expect(() => {
            getStatsFromRawStats(multiStats, 'invalidName');
        }).toThrow();
    });

    it('returns child stats by numerical index', () => {
        // Act
        const result = getStatsFromRawStats(multiStats, 1);

        // Assert
        expect(result).toBe(stats2);
    });

    it('returns child stats by string index', () => {
        // Act
        const result = getStatsFromRawStats(multiStats, '1');

        // Assert
        expect(result).toBe(stats2);
    });

    it('throws if unable to find child stats by index', () => {
        // Act / Assert
        expect(() => {
            getStatsFromRawStats(multiStats, 2);
        }).toThrow();
    });
});

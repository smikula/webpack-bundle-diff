import { deriveChunkGroupData } from '../../src/api/deriveBundleData/deriveChunkGroupData';
import { ChunkGroupData } from '../../src/types/BundleData';

describe('deriveChunkGroupData', () => {
    const assets = [
        { name: 'asset1.js', size: 1 },
        { name: 'asset2.js', size: 2 },
    ];

    describe('produces data for each named chunk group', () => {
        // Arrange
        const stats: any = {
            namedChunkGroups: {
                chunkGroup1: { assets: [] },
                chunkGroup2: { assets: [] },
            },
            assets,
        };

        testForAllWebpackVersions(
            chunkGroupData => {
                // Assert
                expect(chunkGroupData).toEqual({
                    chunkGroup1: { size: 0, assets: [], ignoredAssets: [] },
                    chunkGroup2: { size: 0, assets: [], ignoredAssets: [] },
                });
            },
            stats,
            null
        );
    });

    describe('accounts for each asset in a chunk group', () => {
        // Arrange
        const stats: any = {
            namedChunkGroups: {
                chunkGroup1: { assets: ['asset1.js', 'asset2.js'] },
            },
            assets,
        };

        testForAllWebpackVersions(
            chunkGroupData => {
                // Assert
                expect(chunkGroupData).toEqual({
                    chunkGroup1: { size: 3, assets: ['asset1.js', 'asset2.js'], ignoredAssets: [] },
                });
            },
            stats,
            null
        );
    });

    describe('ignores sourcemap assets by default', () => {
        // Arrange
        const stats: any = {
            namedChunkGroups: {
                chunkGroup1: { assets: ['asset1.js', 'asset1.js.map'] },
            },
            assets,
        };

        testForAllWebpackVersions(
            chunkGroupData => {
                // Assert
                expect(chunkGroupData).toEqual({
                    chunkGroup1: {
                        size: 1,
                        assets: ['asset1.js'],
                        ignoredAssets: ['asset1.js.map'],
                    },
                });
            },
            stats,
            null
        );
    });

    describe('respects the assetFilter option', () => {
        // Arrange
        const stats: any = {
            namedChunkGroups: {
                chunkGroup1: { assets: ['asset1.js', 'asset1.bad'] },
            },
            assets,
        };

        const assetFilter = (asset: string) => !asset.endsWith('.bad');

        testForAllWebpackVersions(
            chunkGroupData => {
                // Assert
                expect(chunkGroupData).toEqual({
                    chunkGroup1: {
                        size: 1,
                        assets: ['asset1.js'],
                        ignoredAssets: ['asset1.bad'],
                    },
                });
            },
            stats,
            { assetFilter }
        );
    });
});

function testForAllWebpackVersions(
    assertion: (chunkGroupData: ChunkGroupData) => void,
    ...[stats, ...remainingParameters]: Parameters<typeof deriveChunkGroupData>
) {
    it('in webpack v4', () => {
        const chunkGroupData = deriveChunkGroupData(stats, ...remainingParameters);
        assertion(chunkGroupData);
    });
    it('in webpack v5', () => {
        const chunkGroupData = deriveChunkGroupData(
            convertStatsToV5Stats(stats as any),
            ...remainingParameters
        );
        assertion(chunkGroupData);
    });
}

interface TestStats {
    namedChunkGroups: Record<string, { assets: string[] }>;
    assets: { name: string; size: number }[];
}

function convertStatsToV5Stats({ namedChunkGroups, assets: statAssets, ...remianingStats }: TestStats): any {
    return {
        ...remianingStats,
        assets: statAssets,
        namedChunkGroups: Object.fromEntries(
            Object.entries(namedChunkGroups).map(([entryName, { assets, ...remainingProps }]) => [
                entryName,
                {
                    ...remainingProps,
                    assets: assets.map(assetName => ({
                        name: assetName,
                        size: statAssets.find(({ name }) => name === assetName)?.size,
                    })),
                },
            ])
        ),
    };
}

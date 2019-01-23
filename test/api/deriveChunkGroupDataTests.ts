import { deriveChunkGroupData } from '../../src/api/deriveBundleData/deriveChunkGroupData';

describe('deriveChunkGroupData', () => {
    const assets = [{ name: 'asset1.js', size: 1 }, { name: 'asset2.js', size: 2 }];

    it('produces data for each named chunk group', () => {
        // Arrange
        const stats: any = {
            namedChunkGroups: {
                chunkGroup1: { assets: [] },
                chunkGroup2: { assets: [] },
            },
            assets,
        };

        // Act
        const chunkGroupData = deriveChunkGroupData(stats);

        // Assert
        expect(chunkGroupData).toEqual({
            chunkGroup1: { size: 0, assets: [], ignoredAssets: [] },
            chunkGroup2: { size: 0, assets: [], ignoredAssets: [] },
        });
    });

    it('accounts for each asset in a chunk group', () => {
        // Arrange
        const stats: any = {
            namedChunkGroups: {
                chunkGroup1: { assets: ['asset1.js', 'asset2.js'] },
            },
            assets,
        };

        // Act
        const chunkGroupData = deriveChunkGroupData(stats);

        // Assert
        expect(chunkGroupData).toEqual({
            chunkGroup1: { size: 3, assets: ['asset1.js', 'asset2.js'], ignoredAssets: [] },
        });
    });

    it('ignores sourcemap assets', () => {
        // Arrange
        const stats: any = {
            namedChunkGroups: {
                chunkGroup1: { assets: ['asset1.js', 'asset1.js.map'] },
            },
            assets,
        };

        // Act
        const chunkGroupData = deriveChunkGroupData(stats);

        // Assert
        expect(chunkGroupData).toEqual({
            chunkGroup1: { size: 1, assets: ['asset1.js'], ignoredAssets: ['asset1.js.map'] },
        });
    });
});

import { Stats } from '../../types/Stats';
import { ChunkGroupData } from '../../types/BundleData';
import { DataOptions } from '../../types/DataOptions';
import { Compilation } from 'webpack';
import { isChunkGroup, isCompilation } from '../../util/typeGuards';

export function deriveChunkGroupData(stats: Stats | Compilation, options: DataOptions) {
    const assetFilter = (options && options.assetFilter) || defaultAssetFilter;
    const chunkGroupData: ChunkGroupData = {};

    // Process each named chunk group
    for (let chunkGroupName of isCompilation(stats)
        ? stats.namedChunkGroups.keys()
        : Object.keys(stats.namedChunkGroups)) {
        const chunkGroup =
            stats.namedChunkGroups instanceof Map
                ? stats.namedChunkGroups.get(chunkGroupName)
                : stats.namedChunkGroups[chunkGroupName];

        let chunkGroupSize = 0;
        let assets: string[] = [];
        let ignoredAssets: string[] = [];

        const chunkGroupAssets = isChunkGroup(chunkGroup)
            ? chunkGroup.getFiles().map((assetName: string) => ({
                  name: assetName,
                  size: (stats as Compilation).getAsset(assetName).info.size,
              }))
            : chunkGroup.assets;

        // Process each asset in the chunk group
        for (let { name, size } of chunkGroupAssets) {
            if (!assetFilter(name)) {
                ignoredAssets.push(name);
            } else {
                assets.push(name);
                chunkGroupSize += size;
            }
        }

        chunkGroupData[chunkGroupName] = { size: chunkGroupSize, assets, ignoredAssets };
    }

    return chunkGroupData;
}

// By default filter out source maps since they don't count towards bundle size
function defaultAssetFilter(asset: string) {
    return !asset.endsWith('.map');
}

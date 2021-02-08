import { Asset, ChunkAsset, Stats } from '../../types/Stats';
import { ChunkGroupData } from '../../types/BundleData';
import { DataOptions } from '../../types/DataOptions';

export function deriveChunkGroupData(stats: Stats, options: DataOptions) {
    const assetFilter = (options && options.assetFilter) || defaultAssetFilter;
    const chunkGroupData: ChunkGroupData = {};

    const getProcessedAsset = getAssetProcessor(stats);

    // Process each named chunk group
    for (let chunkGroupName of Object.keys(stats.namedChunkGroups)) {
        const chunkGroup = stats.namedChunkGroups[chunkGroupName];

        let chunkGroupSize = 0;
        let assets: string[] = [];
        let ignoredAssets: string[] = [];

        // Process each asset in the chunk group
        for (let asset of chunkGroup.assets) {
            const { name, size} = getProcessedAsset(asset);
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

function getAssetProcessor(stats: Stats): (asset: ChunkAsset) => Pick<Asset, 'name' | 'size'> {
    if (
        Object.values(stats.namedChunkGroups).some(({ assets }) =>
            assets.some(a => typeof a === 'object' && 'size' in a)
        )
    ) {
        // In webpack 5, the chunkGroup assets are objects with name and size properties
        return (asset: ChunkAsset) => asset as Pick<Asset, 'name' | 'size'>;
    } else {
        // In webpack 4 and earlier, chunkGroup assets are simply strings
        const assetSizeMap = getAssetSizeMap(stats);
        
        return (asset: ChunkAsset) => ({
            name: asset as string,
            size: assetSizeMap.get(asset as string)
        })
    }
}

// Create a map of asset name -> asset size
function getAssetSizeMap(stats: Stats) {
    const assetSizeMap = new Map<string, number>();

    for (let asset of stats.assets) {
        assetSizeMap.set(asset.name, asset.size);
    }

    return assetSizeMap;
}

// By default filter out source maps since they don't count towards bundle size
function defaultAssetFilter(asset: string) {
    return !asset.endsWith('.map');
}

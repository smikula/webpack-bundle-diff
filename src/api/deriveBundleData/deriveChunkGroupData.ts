import { Stats } from '../../types/Stats';
import { ChunkGroupData } from '../../types/BundleData';

export function deriveChunkGroupData(stats: Stats) {
    const chunkGroupData: ChunkGroupData = {};
    const assetSizeMap = getAssetSizeMap(stats);

    // Process each named chunk group
    for (let chunkGroupName of Object.keys(stats.namedChunkGroups)) {
        const chunkGroup = stats.namedChunkGroups[chunkGroupName];

        let size = 0;
        let assets: string[] = [];
        let ignoredAssets: string[] = [];

        // Process each asset in the chunk group
        for (let asset of chunkGroup.assets) {
            // Source maps and css don't count towards size
            if (asset.endsWith('.map') || asset.endsWith('.css')) {
                ignoredAssets.push(asset);
            } else {
                assets.push(asset);
                size += assetSizeMap.get(asset);
            }
        }

        chunkGroupData[chunkGroupName] = { size, assets, ignoredAssets };
    }

    return chunkGroupData;
}

// Create a map of asset name -> asset size
function getAssetSizeMap(stats: Stats) {
    const assetSizeMap = new Map<string, number>();

    for (let asset of stats.assets) {
        assetSizeMap.set(asset.name, asset.size);
    }

    return assetSizeMap;
}

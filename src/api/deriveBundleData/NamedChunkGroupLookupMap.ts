import { Stats, ChunkId } from '../../types/Stats';

// Helper class to look up what named chunk groups a given chunk is in
export default class NamedChunkGroupLookupMap {
    private map: Map<ChunkId, string[]>;

    constructor(stats: Stats) {
        // Initialize the map from the given stats
        this.map = new Map();
        for (let name of Object.keys(stats.namedChunkGroups)) {
            const chunkGroup = stats.namedChunkGroups[name];

            for (let chunkId of chunkGroup.chunks) {
                if (!this.map.has(chunkId)) {
                    this.map.set(chunkId, []);
                }

                this.map.get(chunkId).push(name);
            }
        }
    }

    getNamedChunkGroups(chunks: ChunkId[]) {
        // Use a set to avoid duplication
        const namedChunkGroups = new Set<string>();

        // Accumulate from all the chunks
        for (let chunkId of chunks) {
            if (this.map.has(chunkId)) {
                for (let namedChunkGroup of this.map.get(chunkId)) {
                    namedChunkGroups.add(namedChunkGroup);
                }
            }
        }

        return [...namedChunkGroups];
    }
}

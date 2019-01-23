import { BundleData } from '../../types/BundleData';
import { DiffResults } from '../../types/DiffResults';

export default function diffChunkGroups(baseline: BundleData, comparison: BundleData): DiffResults {
    const results: DiffResults = {};

    // Iterate over all chunk groups
    const allChunkGroups = new Set([
        ...Object.keys(baseline.chunkGroups),
        ...Object.keys(comparison.chunkGroups),
    ]);

    for (let chunkGroupName of allChunkGroups) {
        const baselineChunkGroup = baseline.chunkGroups[chunkGroupName];
        const comparisonChunkGroup = comparison.chunkGroups[chunkGroupName];

        let delta: number;
        if (!baselineChunkGroup) {
            // New chunk group was added
            delta = comparisonChunkGroup.size;
        } else if (!comparisonChunkGroup) {
            // Chunk group was removed
            delta = -baselineChunkGroup.size;
        } else {
            // Chunk group existed before and after
            delta = comparisonChunkGroup.size - baselineChunkGroup.size;
        }

        // Initialize the entry for the chunk group diff
        results[chunkGroupName] = { delta, added: [], removed: [], changed: [] };
    }

    return results;
}

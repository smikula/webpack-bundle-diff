import { BundleData } from '../../types/BundleData';
import { Stats } from '../../types/Stats';
import { deriveBundleData } from '../deriveBundleData/deriveBundleData';
import diffGraph from './diffGraph';
import { EnhancedModuleGraph } from './EnhancedModuleGraph';
import diffChunkGroups from './diffChunkGroups';
import { DataOptions } from '../../types/DataOptions';

export function diff(
    baseline: BundleData | Stats,
    comparison: BundleData | Stats,
    options?: DataOptions
) {
    // Derive bundle data if necessary
    baseline = getBundleData(baseline, options);
    comparison = getBundleData(comparison, options);

    // Diff named chunk groups
    const results = diffChunkGroups(baseline, comparison);

    // Diff the graph
    diffGraph(
        new EnhancedModuleGraph(baseline.graph),
        new EnhancedModuleGraph(comparison.graph),
        results
    );

    return results;
}

function getBundleData(data: BundleData | Stats, options: DataOptions): BundleData {
    return (<BundleData>data).graph ? <BundleData>data : deriveBundleData(<Stats>data, options);
}

import { BundleData } from '../types/BundleData';
import { Stats } from '../types/Stats';
import { deriveBundleData } from './deriveBundleData';

export function diff(baseline: BundleData | Stats, comparison: BundleData | Stats) {
    // Derive bundle data if necessary
    baseline = getBundleData(baseline);
    comparison = getBundleData(comparison);
}

function getBundleData(data: BundleData | Stats): BundleData {
    return (<BundleData>data).graph ? <BundleData>data : deriveBundleData(<Stats>data);
}

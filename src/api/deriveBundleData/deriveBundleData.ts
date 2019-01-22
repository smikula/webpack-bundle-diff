import { BundleData } from '../../types/BundleData';
import { Stats } from '../../types/Stats';
import { deriveGraph } from './deriveGraph';

export function deriveBundleData(stats: Stats): BundleData {
    return {
        graph: deriveGraph(stats),
    };
}

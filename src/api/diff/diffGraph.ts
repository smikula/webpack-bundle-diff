import { ModuleGraph } from '../../types/BundleData';
import { DiffResults } from '../../types/DiffResults';
import diffModuleNode from './diffModuleNode';

export default function diffGraph(baselineGraph: ModuleGraph, comparisonGraph: ModuleGraph) {
    const results: DiffResults = {};

    // Compare each module (the union of modules from both graphs)
    const allModules = new Set([...Object.keys(baselineGraph), ...Object.keys(comparisonGraph)]);
    for (let moduleName of allModules) {
        diffModuleNode(baselineGraph, comparisonGraph, moduleName, results);
    }

    return results;
}

import { DiffResults } from '../../types/DiffResults';
import diffModuleNode from './diffModuleNode';
import { EnhancedModuleGraph } from './EnhancedModuleGraph';

export default function diffGraph(
    baselineGraph: EnhancedModuleGraph,
    comparisonGraph: EnhancedModuleGraph
) {
    const results: DiffResults = {};

    // Compare each module (the union of modules from both graphs)
    const allModules = new Set([
        ...baselineGraph.getAllModuleNames(),
        ...comparisonGraph.getAllModuleNames(),
    ]);

    for (let moduleName of allModules) {
        diffModuleNode(baselineGraph, comparisonGraph, moduleName, results);
    }

    return results;
}

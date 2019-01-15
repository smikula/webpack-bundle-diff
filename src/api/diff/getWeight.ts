import { ImportWeight } from '../../types/DiffResults';
import { EnhancedModuleGraph } from './EnhancedModuleGraph';

// Calculate weight incurred by an added module and its dependencies
export function getAddedWeight(
    moduleName: string,
    baseline: EnhancedModuleGraph,
    comparison: EnhancedModuleGraph,
    chunkGroupName: string
) {
    return getModuleWeight(moduleName, comparison, baseline, chunkGroupName);
}

// Calculate weight reduced by removing a module and its dependencies
export function getRemovedWeight(
    moduleName: string,
    baseline: EnhancedModuleGraph,
    comparison: EnhancedModuleGraph,
    chunkGroupName: string
) {
    return getModuleWeight(moduleName, baseline, comparison, chunkGroupName);
}

function getModuleWeight(
    moduleName: string,
    targetGraph: EnhancedModuleGraph,
    oppositeGraph: EnhancedModuleGraph,
    chunkGroupName: string
) {
    const visited = new Set<string>();
    const weight: ImportWeight = {
        moduleCount: 0,
        size: 0,
        modules: [],
    };

    getImportWeightRecursive(
        moduleName,
        targetGraph,
        oppositeGraph,
        chunkGroupName,
        weight,
        visited
    );

    return weight;
}

function getImportWeightRecursive(
    moduleName: string,
    targetGraph: EnhancedModuleGraph,
    oppositeGraph: EnhancedModuleGraph,
    chunkGroupName: string,
    weight: ImportWeight,
    visited: Set<string>
) {
    // If this node has already been visited, bail out
    if (visited.has(moduleName)) {
        return;
    } else {
        visited.add(moduleName);
    }

    // If we've hit a module outside the chunk group, bail out
    if (!targetGraph.hasModule(moduleName, chunkGroupName)) {
        return;
    }

    // If we've hit a module that is also in the opposite graph, bail out.  E.g. if we're
    // calculating added weight but the module also existed in the baseline graph, it doesn't
    // count; or if we're calculating removed weight but the module still exists in the comparison
    // graph, it doesn't count.
    if (oppositeGraph.hasModule(moduleName, chunkGroupName)) {
        return;
    }

    // Account for this module
    const module = targetGraph.getModule(moduleName);
    weight.moduleCount++;
    weight.size += module.size;
    weight.modules.push(moduleName);

    // Visit children
    for (let child of module.children) {
        getImportWeightRecursive(
            child,
            targetGraph,
            oppositeGraph,
            chunkGroupName,
            weight,
            visited
        );
    }
}

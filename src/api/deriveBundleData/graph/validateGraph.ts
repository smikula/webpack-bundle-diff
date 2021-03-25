import { ModuleGraph } from '../../../types/BundleData';

export function validateGraph(graph: ModuleGraph) {
    const errors: string[] = [];

    for (const moduleName of Object.keys(graph)) {
        // Ensure concatenated modules have been decomposed
        if (moduleName.match(/ \+ \d+ modules$/)) {
            errors.push('Concatenated module has not been decomposed: ' + moduleName);
        }

        // Ensure the only modules without parents are 1) entry modules or 2) the webpack runtime
        const module = graph[moduleName];
        if (
            !module.directParents.length &&
            !module.lazyParents.length &&
            !module.entryType &&
            !moduleName.startsWith('webpack/runtime/')
        ) {
            errors.push('Orphaned module: ' + moduleName);
        }

        // Validate edges
        for (const parentName of [...module.directParents, ...module.lazyParents]) {
            if (!graph[parentName]) {
                errors.push(`Parent module doesn't exist: ${parentName} -> ${moduleName}`);
            }
        }
    }

    // If there are any errors, report them and fail
    if (errors.length) {
        for (const error of errors) {
            console.error('Error: ' + error);
        }

        throw new Error('Errors detected in module graph.');
    }
}

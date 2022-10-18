import { Reason } from '../../../types/Stats';
import ModuleIdToNameMap from './ModuleIdToNameMap';

export function processReasons(
    reasons: Pick<Reason, 'moduleName' | 'moduleId' | 'type'>[],
    moduleIdToNameMap: ModuleIdToNameMap
) {
    const directParents = new Set<string>();
    const lazyParents = new Set<string>();
    let entryType: string | undefined = undefined;

    for (const reason of reasons) {
        if (!reason.type) {
            // Entry module sometimes have spurious reasons without a type
            continue;
        } else if (reason.type.endsWith('entry')) {
            // Identify entry modules
            entryType = reason.type;

            // There is no parent module in this case, so just move on
            continue;
        }

        // If moduleId is present, use that to look up the module name.  (The moduleName
        // property, in that case, has something like "foo.js + 12 modules" which isn't what we
        // want.)  But if there is no moduleId, use the moduleName instead - it appears to be
        // correct in that case.
        const moduleName =
            (reason.moduleId && moduleIdToNameMap.get(reason.moduleId)) || reason.moduleName;

        // We should have a module name at this point
        if (!moduleName) {
            throw new Error(`Unable to determine module name.`);
        }

        // Distinguish between lazy and normal imports
        const isLazyParent = reason.type === 'import()';
        if (isLazyParent) {
            lazyParents.add(moduleName);
        } else {
            directParents.add(moduleName);
        }
    }

    return {
        parents: [...directParents, ...lazyParents],
        directParents: [...directParents],
        lazyParents: [...lazyParents],
        entryType,
    };
}

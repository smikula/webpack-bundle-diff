import { Reason } from '../../../types/Stats';

export function processReasons(reasons: Reason[]) {
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

        const parentModuleName = reason.resolvedModule;
        if (!parentModuleName) {
            throw new Error(`Missing reason.resolvedModule.`);
        }

        // Distinguish between lazy and normal imports
        const isLazyParent = reason.type === 'import()';
        if (isLazyParent) {
            lazyParents.add(parentModuleName);
        } else {
            directParents.add(parentModuleName);
        }
    }

    return {
        parents: [...directParents, ...lazyParents],
        directParents: [...directParents],
        lazyParents: [...lazyParents],
        entryType,
    };
}

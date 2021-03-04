export function arrayUnion<T>(...arrays: T[][]): T[] {
    const union = new Set<T>();
    for (const array of arrays) {
        for (const item of array) {
            union.add(item);
        }
    }

    return [...union];
}

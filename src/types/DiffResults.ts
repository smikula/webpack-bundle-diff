// Diff between two BundleData objects
export interface DiffResults {
    [chunkGroupName: string]: ChunkGroupDiff;
}

// Diff of a particular chunk group
export interface ChunkGroupDiff {
    added: ModuleDiff[];
    removed: ModuleDiff[];
    changed: ModuleDelta[];
}

// Information about a module that was added or removed from a chunk group
export interface ModuleDiff {
    module: string;
    parents: string[];
}

// Information about a module whose size changed
export interface ModuleDelta {
    module: string;
    delta: number;
}

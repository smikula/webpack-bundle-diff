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
    weight: ImportWeight;
}

// Information about the impact of a particular module import
export interface ImportWeight {
    moduleCount: number;
    size: number;
    modules: string[];
}

// Information about a module whose size changed
export interface ModuleDelta {
    module: string;
    delta: number;
}

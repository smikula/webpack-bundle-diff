export interface BundleData {
    graph: ModuleGraph;
    chunkGroups: ChunkGroupData;
}

export interface ModuleGraph {
    [id: string]: ModuleGraphNode;
}

export interface ModuleGraphNode {
    namedChunkGroups: string[];
    containsHoistedModules?: boolean;
    name: string;
    entryType?: string;
    parents: string[];
    directParents: string[];
    lazyParents: string[];
    size: number;
}

export interface ChunkGroupData {
    [chunkGroupName: string]: ChunkGroupRecord;
}

export interface ChunkGroupRecord {
    size: number;
    assets: string[];
    ignoredAssets: string[];
}

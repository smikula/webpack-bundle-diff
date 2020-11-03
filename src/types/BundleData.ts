export interface BundleData {
    graph: ModuleGraph;
    chunkGroups: ChunkGroupData;
}

export interface ModuleGraph {
    [id: string]: ModuleGraphNodex;
}

export interface ModuleGraphNode {
    namedChunkGroups: string[];
    containsHoistedModules?: boolean;
    name: string;
    parents: string[];
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

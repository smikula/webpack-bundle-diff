// A minimal subset of the stats.json schema
export interface Stats {
    assets: Asset[];
    chunks: Chunk[];
    modules: Module[];
}

export interface Asset {
    name: string;
    chunks: ChunkId[];
    size: number;
}

export interface Chunk {
    id: ChunkId;
    modules: Module[];
}

export interface Module {
    chunks: ChunkId[];
    id: string | number;
    identifier: string;
    modules?: Module[];
    name: string;
    reasons: Reason[];
    size: number;
}

export interface Reason {
    moduleId: string | number;
    type: string;
    userRequest: string;
}

export type ChunkId = number | string;

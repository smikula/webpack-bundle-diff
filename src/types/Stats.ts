// A minimal subset of the stats.json schema
export interface Stats {
    assets: Asset[];
    chunks: Chunk[];
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
    id: string;
    name: string;
    size: number;
    modules: Module[];
}

export type ChunkId = number | string;

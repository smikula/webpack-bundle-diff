// A minimal subset of the stats.json schema
export interface Stats {
    assets: Asset[];
    chunks: Chunk[];
    modules: Module[];
    namedChunkGroups: { [name: string]: NamedChunkGroup };
    name?: string;
}

export interface MultiStats {
    children: Stats[];
}

export type RawStats = Stats | MultiStats;

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
    moduleName: string;
    type: string;
    userRequest: string;
}

export type ChunkAsset = Pick<Asset, 'name' | 'size'>;

export interface NamedChunkGroup {
    assets: ChunkAsset[];
    chunks: ChunkId[];
}

export type ChunkId = number | string;

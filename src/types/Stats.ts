import {
    StatsAsset,
    StatsChunk,
    StatsChunkGroup,
    StatsCompilation,
    StatsModule,
    StatsModuleReason,
} from 'webpack';

// A minimal subset of the stats.json schema
export type Stats = StatsCompilation &
    Required<Pick<StatsCompilation, 'assets' | 'chunks' | 'modules' | 'namedChunkGroups'>>;

export type MultiStats = StatsCompilation & Required<Pick<StatsCompilation, 'children'>>;

export type RawStats = StatsCompilation;

export type Asset = StatsAsset;

export type Chunk = StatsChunk;

export type Module = StatsModule;

export type Reason = StatsModuleReason;

export type ChunkAsset = Pick<Asset, 'name' | 'size'>;

export type NamedChunkGroup = StatsChunkGroup;

export type ChunkId = number | string;

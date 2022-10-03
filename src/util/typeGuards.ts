import {
    Compilation,
    Module,
    MultiStats,
    Stats,
    StatsChunkGroup,
    StatsCompilation,
    StatsModule,
} from 'webpack';

export function isStatsCompilation(
    stats: StatsCompilation | Stats | MultiStats
): stats is StatsCompilation {
    return 'children' in stats;
}

export function isMultiStats(stats: StatsCompilation | Stats | MultiStats): stats is MultiStats {
    return 'stats' in stats;
}

export function isStats(
    stats: StatsCompilation | Stats | MultiStats | Compilation
): stats is Stats {
    return 'compilation' in stats;
}

// ChunkGroup is not directly exported from webpack types
export type ChunkGroup = Compilation['chunkGroups'] extends (infer T)[] ? T : never;

export function isChunkGroup(chunkGroup: StatsChunkGroup | ChunkGroup): chunkGroup is ChunkGroup {
    return 'pushChunk' in chunkGroup;
}

export function isCompilation(stats: Compilation | StatsCompilation): stats is Compilation {
    return 'hooks' in stats;
}

export function isStatsModule(mod: StatsModule | Module): mod is StatsModule {
    return typeof mod.identifier === 'string';
}

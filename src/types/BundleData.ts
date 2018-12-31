import { ChunkId } from './Stats';

export interface BundleData {
    graph: ModuleGraph;
}

export interface ModuleGraph {
    [id: string]: ModuleGraphNode;
}

export interface ModuleGraphNode {
    chunks: ChunkId[];
    containsHoistedModules?: boolean;
    isHoisted?: boolean;
    parents: string[];
    size: number;
}

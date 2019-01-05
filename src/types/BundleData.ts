export interface BundleData {
    graph: ModuleGraph;
}

export interface ModuleGraph {
    [id: string]: ModuleGraphNode;
}

export interface ModuleGraphNode {
    namedChunkGroups: string[];
    containsHoistedModules?: boolean;
    name: string;
    parents: string[];
    size: number;
}

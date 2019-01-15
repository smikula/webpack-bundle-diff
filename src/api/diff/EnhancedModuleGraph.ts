import { ModuleGraph, ModuleGraphNode } from '../../types/BundleData';

export class EnhancedModuleGraph {
    private graph: Map<string, EnhancedModuleGraphNode>;

    constructor(moduleGraph: ModuleGraph) {
        // First pass: just copy the original graph
        this.graph = new Map();
        for (let moduleName of Object.keys(moduleGraph)) {
            this.graph.set(moduleName, {
                ...moduleGraph[moduleName],
                children: [],
            });
        }

        // Second pass: fill in the children links
        for (let moduleName of this.graph.keys()) {
            for (let parentModuleName of this.graph.get(moduleName).parents) {
                this.graph.get(parentModuleName).children.push(moduleName);
            }
        }
    }

    public getModule(moduleName: string) {
        return this.graph.get(moduleName);
    }

    public hasModule(moduleName: string, chunkGroupName?: string) {
        // Check if the module exists (optionally checking if it exists in a given chunk group)
        const module = this.getModule(moduleName);
        return module && (!chunkGroupName || module.namedChunkGroups.indexOf(chunkGroupName) >= 0);
    }

    public getAllModuleNames() {
        return this.graph.keys();
    }
}

interface EnhancedModuleGraphNode extends ModuleGraphNode {
    children: string[];
}

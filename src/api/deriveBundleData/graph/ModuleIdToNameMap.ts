import { Compilation, Module } from 'webpack';
import { Stats, Module as StatsModule } from '../../../types/Stats';

// Helper class to map module IDs to module names
export default class ModuleIdToNameMap {
    private map: Map<string | number, string>;

    constructor(stats: Stats | Compilation) {
        // Initialize the map from the given stats
        this.map = new Map();
        for (let module of stats.modules as Iterable<
            | StatsModule
            | (Module & {
                  readableIdentifier(requestShortener: Compilation['requestShortener']): string;
              })
        >) {
            // If the module contains multiple hoisted modules, assume the first one is the primary module
            let name =
                'readableIdentifier' in module
                    ? module.readableIdentifier((stats as Compilation).requestShortener)
                    : module.modules
                    ? module.modules[0].name
                    : module.name;
            this.map.set(module.id, name);
        }
    }

    get(id: string | number) {
        return this.map.get(id);
    }
}

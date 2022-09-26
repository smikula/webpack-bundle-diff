import { Compilation, Module } from 'webpack';
import { Stats, Module as StatsModule } from '../../../types/Stats';
import { getModuleName } from '../../../util/getModuleName';

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
            let name = getModuleName(module, stats);
            this.map.set(module.id, name);
        }
    }

    get(id: string | number) {
        return this.map.get(id);
    }
}

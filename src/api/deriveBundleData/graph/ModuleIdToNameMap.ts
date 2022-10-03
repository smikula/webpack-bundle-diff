import { Compilation } from 'webpack';
import { Stats } from '../../../types/Stats';
import { getModuleName } from '../../../util/getModuleName';
import { getId } from '../../../util/getId';
import { StatsOrComiplationModule } from '../../../types/StatsOrComiplationModule';

// Helper class to map module IDs to module names
export default class ModuleIdToNameMap {
    private map: Map<string | number, string>;

    constructor(stats: Stats | Compilation) {
        // Initialize the map from the given stats
        this.map = new Map();

        for (let module of stats.modules as Iterable<StatsOrComiplationModule>) {
            // If the module contains multiple hoisted modules, assume the first one is the primary module
            const name = getModuleName(module, stats);
            this.map.set(getId(module, stats), name);
        }
    }

    get(id: string | number) {
        return this.map.get(id);
    }
}

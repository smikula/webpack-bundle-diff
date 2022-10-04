import { Compilation, Module } from 'webpack';
import { Stats, Module as StatsModule } from '../types/Stats';

export function getId(m: Module | StatsModule, stats: Stats | Compilation) {
    if ('hooks' in stats) {
        (stats as Compilation).chunkGraph.getModuleId(m as Module);
    } else {
        return m.id;
    }
}

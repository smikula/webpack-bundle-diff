import { Compilation, Module } from 'webpack';
import { Stats, Module as StatsModule } from '../types/Stats';

export function getModuleName(
    module:
        | StatsModule
        | (Module & {
              readableIdentifier(requestShortener: Compilation['requestShortener']): string;
          }),
    stats: Stats | Compilation
): string {
    return 'readableIdentifier' in module
        ? module.readableIdentifier((stats as Compilation).requestShortener)
        : module.modules
        ? module.modules[0].name
        : module.name;
}

import { Compilation } from 'webpack';
import { Stats } from '../types/Stats';
import { StatsOrComiplationModule } from '../types/StatsOrComiplationModule';

export function getModuleName(
    module: StatsOrComiplationModule,
    stats: Stats | Compilation
): string {
    const rootModule = module.modules?.[0] ?? module;
    return 'readableIdentifier' in rootModule
        ? rootModule.readableIdentifier((stats as Compilation).requestShortener)
        : rootModule.name;
}

import { Compilation } from 'webpack';
import { Stats } from '../types/Stats';
import { StatsOrComiplationModule } from '../types/StatsOrComiplationModule';

export function getModuleName(
    module: StatsOrComiplationModule,
    stats: Stats | Compilation
): string {
    return 'readableIdentifier' in module
        ? module.readableIdentifier((stats as Compilation).requestShortener)
        : module.modules
        ? module.modules[0].name
        : module.name;
}

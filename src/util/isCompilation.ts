import { Compilation } from 'webpack';

export function isCompilation(rawStats: object): rawStats is Compilation {
    return 'hooks' in rawStats;
}

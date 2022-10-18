import { Compilation, Module } from 'webpack';
import { Module as StatsModule } from './Stats';

export type StatsOrComiplationModule =
    | StatsModule
    | (Module & {
          readableIdentifier(requestShortener: Compilation['requestShortener']): string;
          modules?: Module[];
      });

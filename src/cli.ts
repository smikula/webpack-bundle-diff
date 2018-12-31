import * as commander from 'commander';
import * as fs from 'fs';
import readJson from './util/readJson';
import { Stats } from './types/Stats';
import { deriveBundleData } from './api/deriveBundleData';

// Read the package version from package.json
const packageVersion = require('../package').version;

// Set up the available commands
const program = commander.version(packageVersion);

program
    .command('data <stats>')
    .description('derive bundle data from stats')
    .option('-o, --outFile <string>', 'output file')
    .action((statsPath, options) => {
        console.log('Deriving bundle data from stats...');
        readJson(statsPath).then((stats: Stats) => {
            debugger;
            const bundleData = deriveBundleData(stats);
            fs.writeFileSync(options.outFile, JSON.stringify(bundleData, null, 2));
        });
    });

program
    .command('diff <baseline> <comparison>')
    .description('diff bundles')
    .option('-o, --outFile <string>', 'output file')
    .action((baseline, comparison, options) => {
        console.log('Diffing bundles...');
        console.log(baseline, comparison, options);
    });

// Execute the command line
program.parse(process.argv);

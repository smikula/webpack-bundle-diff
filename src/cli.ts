import * as commander from 'commander';
import readJson from './util/readJson';
import { Stats } from './types/Stats';

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
            console.log(stats);
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

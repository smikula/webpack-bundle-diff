import * as commander from 'commander';

// Read the package version from package.json
const packageVersion = require('../package').version;

// Set up the available commands
const program = commander.version(packageVersion);

program
    .command('data <stats>')
    .description('derive bundle data from stats')
    .option('-o, --outFile <string>', 'output file')
    .action((stats, options) => {
        console.log('Deriving bundle data from stats...');
        console.log(stats, options);
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

// Indicate success or failure via the exit code
process.exitCode = 0;

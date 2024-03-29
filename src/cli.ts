import * as commander from 'commander';
import * as fs from 'fs';
import readJson from './util/readJson';
import { RawStats } from './types/Stats';
import { deriveBundleData, diff, generateReport, DiffResults } from './index';

// Read the package version from package.json
const packageVersion = require('../package').version;

// Set up the available commands
const program = commander.version(packageVersion);

program
    .command('data <stats>')
    .description('derive bundle data from stats')
    .option('-o, --outFile <string>', 'output file')
    .option('-c, --childStats <string>', 'child stats name or index')
    .option('-v, --validate', 'validate module graph')
    .action((statsPath, options) => {
        console.log('Deriving bundle data from stats...');
        readJson(statsPath)
            .then((stats: RawStats) => {
                const { childStats, validate } = options;
                const bundleData = deriveBundleData(stats, { childStats, validate });
                fs.writeFileSync(options.outFile, JSON.stringify(bundleData, null, 2));
            })
            .catch(reportError);
    });

program
    .command('diff <baseline> <comparison>')
    .description('diff bundles')
    .option('-o, --outFile <string>', 'output file')
    .action((baselinePath, comparisonPath, options) => {
        console.log('Diffing bundles...');
        Promise.all([readJson(baselinePath), readJson(comparisonPath)])
            .then(data => {
                let result = diff(data[0], data[1]);
                fs.writeFileSync(options.outFile, JSON.stringify(result, null, 2));
            })
            .catch(reportError);
    });

program
    .command('report <diff>')
    .description('generate a markdown report from a diff')
    .option('-o, --outFile <string>', 'output file')
    .action((diffPath, options) => {
        console.log('Generating report...');
        readJson(diffPath)
            .then((diff: DiffResults) => {
                const markdown = generateReport(diff);
                fs.writeFileSync(options.outFile, markdown);
            })
            .catch(reportError);
    });

// Execute the command line
program.parse(process.argv);

function reportError(error: Error) {
    console.error('webpack-bundle-diff failed with an error:', error);
}

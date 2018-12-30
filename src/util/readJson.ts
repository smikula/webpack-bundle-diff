import * as fs from 'fs';
import * as es from 'event-stream';

const JSONStream = require('JSONStream');

// Webpack's stats.json file can be huge, too large to read in as a single string.  The following
// uses JSONStream to stream the file and parse it on the fly.
export default function readJson(path: string): Promise<any> {
    return new Promise((resolve, reject) => {
        let parsedObject: any = {};

        let stream = fs
            .createReadStream(path, { encoding: 'utf8' })
            .pipe(JSONStream.parse('$*'))
            .pipe(
                es.mapSync((data: any) => {
                    parsedObject[data.key] = data.value;
                })
            );

        stream.on('close', () => {
            resolve(parsedObject);
        });

        stream.on('error', reject);
    });
}

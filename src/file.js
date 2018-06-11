import { Observable, Subject, ReplaySubject, from, of, range, bindNodeCallback } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import * as fs from 'fs';


export default function getFileContent(file) {
    var readFileAsObservable = bindNodeCallback(fs.readFile);
    var result = readFileAsObservable(file, 'utf8');
    result
        // .pipe(filter(line => console.log(`[${line}]`)))
        .subscribe(
            x => console.log(x),
            e => console.error(e)
        );
}
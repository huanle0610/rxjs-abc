console.log('hello webpack1');
import { Observable, Subject, ReplaySubject, from, of, range, bindNodeCallback } from 'rxjs';
import { map, filter, switchMap, tap } from 'rxjs/operators';
import demoAsync from './async'
import demoPow from './pow'
import getFileContent from './file'
import readLine from './readline';

console.log('rxjs-start...')
range(1, 20)
    .pipe(filter(x => x % 2 === 1), map(x => x + x))
    .subscribe(x => console.log(x));

console.log('again...')

range(1, 20)
    .pipe(filter(x => x % 2 === 1), tap(x => console.log(`tap ${x}`)))
    .pipe(map(x => x + x))
    .subscribe(x => console.log(x));


console.log('more...')

// getFileContent('./src/async.js')

demoPow()

// readLine()

demoAsync()
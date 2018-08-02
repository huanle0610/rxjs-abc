import {
  Observable, Subject, ReplaySubject, from, of, range, bindNodeCallback,
} from 'rxjs';
import {
  map, filter, switchMap, tap, skip, zip, finalize, buffer,
} from 'rxjs/operators';
import fetch from 'node-fetch';
import fs from 'fs';


import * as readline from 'readline';
import readLine from './readline';
import getFileContent from './file';
import demoPow from './pow';
import demoAsync from './async';

console.log('hello webpack1');

console.log('rxjs-start...');
range(1, 20)
  .pipe(filter(x => x % 2 === 1), map(x => x + x))
  .subscribe(x => console.log(x));

console.log('again...');

range(1, 20)
  .pipe(filter(x => x % 2 === 1), tap(x => console.log(`tap ${x}`)))
  .pipe(map(x => x + x))
  .subscribe(x => console.log(x));


console.log('more...');

// demoPow();

// demoAsync();

from(fetch('https://jsonplaceholder.typicode.com/posts/1').then(r => r.json()))
  .pipe(map(v => `amtf - ${v.userId}`))
  .subscribe(console.log);

const readdir$ = bindNodeCallback(fs.readdir);
const source$ = readdir$('./src');
// const subscription = source$.subscribe(
//   res => console.log(`List of directories:  ${res} `),
//   error => console.log(`Error:  ${error} `),
//   () => console.log('Done!'),
// );

const readfile$ = bindNodeCallback(fs.readFile);
const readSource$ = readfile$('/etc/hostsa', 'utf-8');
// .subscribe(
//   res => console.log(`file content ${res}`),
// )

readSource$.pipe(
  zip(
    source$,
    (hosts, files) => {
      console.log(hosts, files, 'haha');
    },
  ),
).subscribe(
  (x) => {
    console.log(`Next: ${x}`);
  },
  (err) => {
    console.log(`Error: ${err}`);
  },
  () => {
    console.log('Completed');
  },
);

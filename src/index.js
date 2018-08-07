import {
  Observable, Subject, ReplaySubject, from, of, range, bindNodeCallback,
} from 'rxjs';
import {
  map, filter, merge, switchMap, flatMap, repeat, retryWhen, mergeMap, tap, skip, zip, finalize, buffer, catchError,
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

// Print results.
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(`${op} error: ${err.toString()}`);
    if (res) console.log(`${op} status: ${res.constructor.name}`);
  };
}

const catchErrorAndLog = op => catchError((val) => {
  console.error(`[${op}] I caught: ${val}`);
  // return of(`[${op}] I caught: ${val}`);
  return of(val);
});

const searchDirs$ = of(['/etc/skel/', '/home/amtf']);
searchDirs$
  // .pipe(map(v => console.log(v, 123)))
  .pipe(tap(v => console.log(v, 123)))
  .pipe(tap(v => console.log(v, 123)))
  .subscribe(printResultFor('searchDirs$'));

const request$ = from(fetch('https://jsonplaceholder.typicode.com/posts/1').then(r => r.json()))
  .pipe(catchError(val => of(`I caught: ${val}`)))
  .pipe(map(v => `amtf - ${v.userId}`));
  // .subscribe(console.log);

const readdir$ = bindNodeCallback(fs.readdir);
const source$ = readdir$('./src');
// const subscription = source$.subscribe(
//   res => console.log(`List of directories:  ${res} `),
//   error => console.log(`Error:  ${error} `),
//   () => console.log('Done!'),
// );

const readfile$ = bindNodeCallback(fs.readFile);
const readSource$ = readfile$('/etc/hosts1', 'utf-8')
  .pipe(catchErrorAndLog('readSource$'));
// .subscribe(
//   res => console.log(`file content ${res}`),
// );

readSource$.pipe(
  zip(
    source$,
    request$,
    (hosts, files, user) => {
      console.log(typeof hosts);
      console.log(hosts, files, user, 'haha');
      return true;
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

// https://www.learnrxjs.io/operators/error_handling/retrywhen.html
// 0 unknown 1 OK 2 need try 3 error
const dns = require('dns');

const res = 0;

const lookup$ = bindNodeCallback(dns.lookup);

const lookupA$ = lookup$('iana.org')
  .pipe(catchError(e => of(!e)))
  .pipe(map(v => v.length === 2));
const lookupB$ = lookup$('iana.aorg')
  .pipe(catchError(e => of(!e)));
lookupA$
  .pipe(
    mergeMap(
      () => lookupB$,
      (a, b) => of(`${a ? 1 : 0}${b ? 1 : 0}`),
    ),
  )
  .pipe(tap(a => console.error(a)))
  .pipe(retryWhen(v => ['00', '01', '10'].includes(v)))
  .subscribe(
    (x) => {
      console.log(`Next: ${x}`);
    },
    (err) => {
      console.error(`Error: ${err}`);
      console.error(err);
    },
    () => {
      console.log('Completed');
    },
  );

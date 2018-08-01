import { Subject } from 'rxjs';
import { buffer, filter, finalize } from 'rxjs/operators';
import * as path from 'path';
import * as fs from 'fs';
import * as readline from 'readline';

const filepath = path.join(path.resolve(), 'files', 'names_1000.json');

const reader$ = new Subject();
readline.createInterface(fs.createReadStream(filepath))
  .on('line', input => reader$.next(input))
  .on('error', err => reader$.error(err))
  .on('close', () => { reader$.complete(); console.log('ReadStream is closed..'); });

const ws = fs.createWriteStream(path.join(path.resolve(), 'output', 'result.json'))
  .on('close', () => console.log('WriteStream is closed.'));

const buffer$ = new Subject();
const flusher$ = new Subject();
let counter = 0;

// ここからRx
reader$
  .pipe(finalize(() => { // reader$.complete()が呼ばれるとここに到達する。
    flusher$.next(); // まだ残っているバッファーを流す。
    flusher$.complete(); // flusher$とbuffer$をcompleteさせる。
  }))
  .subscribe((line) => {
    buffer$.next(`${line}\n`); // 読み込んだ1行をバッファーに追加する。
    counter += 1;
    if (counter % 10 === 0) {
      flusher$.next(); // バッファーを流す。
    }
  });

buffer$
  .pipe(buffer(flusher$)) // flusher$.next()されるまでバッファーを蓄積する。
  .pipe(filter(data => data.length > 0))
  .pipe(finalize(() => { // flusher$.complete()が呼ばれるとここに到達する。
    ws.end();
  }))
  .subscribe((data) => {
    console.log('chunk:', data.length, counter);
    ws.write(data.join('')); // 10行単位でファイルに書き込みする。
  });

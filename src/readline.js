import { filter, scan } from 'rxjs/operators';
import { fromReadLineStream } from './fromStream';

export default function readLine() {
  const readline = require('readline');
  const fs = require('fs');

  const rl = readline.createInterface({
    input: fs.createReadStream('./src/file.js'),
  });

  const subscription = fromReadLineStream(rl)
    .pipe(
      filter(line => line.startsWith('import')),
    )
    .subscribe((x) => { console.log(`[count -> ${x}]`); });
}

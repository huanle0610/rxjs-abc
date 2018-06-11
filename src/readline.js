import { fromReadLineStream } from './fromStream';
import { filter, scan } from 'rxjs/operators';

export default function readLine() {
    var readline = require('readline');
    var fs = require('fs');
    
    var rl = readline.createInterface({
      input: fs.createReadStream('./src/file.js')
    });
    
    var subscription = fromReadLineStream(rl)
        .pipe(
          filter(line => line.startsWith('import')),
        )
        .subscribe(function (x) { console.log(`[$\{count\} -> ${x}]`); });
}

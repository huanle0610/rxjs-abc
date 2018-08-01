import { range } from 'rxjs';
import { skip, zip } from 'rxjs/operators';

const range$ = range(0, 5);
range$.pipe(skip(2))
  .subscribe(console.error);

const source = range$.pipe(
  zip(
    range$,
    range$.pipe(skip(1)),
    range$.pipe(skip(2)),
    function (s1, s2, s3) {
      console.warn(arguments);
      return `${s1}:${s2}:${s3}`;
    },
  ),
)
  .subscribe(
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

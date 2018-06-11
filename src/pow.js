import { from } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export default function demoPow() {
    const pow = (p) => {
        return source => source.pipe(map(n => n ** p))
    }
    
    const source$ = from([2, 3, 4, 5])
    source$.pipe(
        filter(x => x > 3),
        pow(4)
    ).subscribe(x => console.log(x));
}

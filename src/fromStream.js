import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

// Adapted from https://github.com/Reactive-Extensions/rx-node/blob/87589c07be626c32c842bdafa782fca5924e749c/index.js#L52
export default function fromStream(stream, finishEventName = 'end', dataEventName = 'data') {
  stream.pause();

  return Observable.create((observer) => {
    function dataHandler(data) {
      console.log(data);
      observer.next(data);
    }

    function errorHandler(err) {
      observer.error(err);
    }

    function endHandler() {
      observer.complete();
    }

    stream.addListener(dataEventName, dataHandler);
    stream.addListener('error', errorHandler);
    stream.addListener(finishEventName, endHandler);

    stream.resume();

    return () => {
      stream.removeListener(dataEventName, dataHandler);
      stream.removeListener('error', errorHandler);
      stream.removeListener(finishEventName, endHandler);
    };
  }).pipe(share());
}


export function fromReadLineStream(stream) {
  return fromStream(stream, 'close', 'line');
}

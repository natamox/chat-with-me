import { useState, useEffect } from 'react';
import { Observable } from 'rxjs';

export function useObservable<T = any>(v: Observable<T>, defaultValue?: T) {
  const [state, setState] = useState<T>(defaultValue!);
  useEffect(() => {
    const sub = v.subscribe((d) => {
      setState(d);
    });
    return () => {
      sub.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return state;
}


import React, {EffectCallback, DependencyList, useRef, useEffect} from 'react';

export function useUpdateEffect(effect: EffectCallback, deps?: DependencyList) {
  const ref = useRef(true);

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      return;
    }
    return effect();
  }, deps);
}


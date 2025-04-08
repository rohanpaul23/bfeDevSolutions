
import { EffectCallback, useEffect, useRef } from 'react'

export function useEffectOnce(effect: EffectCallback) {
  const ref = useRef(true);

  useEffect(()=>{
    if(ref.current){
      ref.current = false
      return effect()
    }
  },[])
}

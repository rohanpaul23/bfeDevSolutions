import { useEffect, useRef } from "react";

export function useIsFirstRender(): boolean {
  const isFirstRender = useRef(true)

  useEffect(()=>{
    if(isFirstRender.current){
      isFirstRender.current = false
    }
  })

  return isFirstRender.current
}
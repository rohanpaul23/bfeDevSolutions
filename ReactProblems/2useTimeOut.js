import { useEffect, useRef } from "react";

export function useTimeout(callback: () => void, delay: number) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  
  useEffect(()=>{
    let timerId = setTimeout(()=>{
      callbackRef.current()
    },delay)

    return(()=>{
      clearTimeout(timerId)
    })
  },[delay])
}
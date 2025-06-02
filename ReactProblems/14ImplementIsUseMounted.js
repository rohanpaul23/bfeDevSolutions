import React, { useCallback, useEffect, useRef } from 'react';
export function useIsMounted(): () => boolean {
const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])
  return useCallback(()=>isMounted.current,[]) 
}

// https://usehooks-ts.com/react-hook/use-is-mounted

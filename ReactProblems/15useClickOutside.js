import React, { useEffect, useRef } from 'react'

export function useClickOutside(callback: () => void) {
  const ref = useRef();

  useEffect(()=>{

    const handleClick = (e)=> {
      if(ref?.current && e.target && !ref?.current?.contains(e.target)){
        callback()
      }
    }
    document.addEventListener('click', handleClick)

    return (()=>{
      document.removeEventListener('click', handleClick)
    })
  },[])

  return ref;
}

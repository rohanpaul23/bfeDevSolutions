


import React, { Ref, useCallback, useRef, useState } from 'react'

export function useFocus<T extends HTMLElement>(): [Ref<T>, boolean] {
  const [isFocused,setIsFocused] = useState(false)
  const ref = useRef<T>()


  const handleToggle = ()=>{
    setIsFocused((prevIsFocused)=> !prevIsFocused);
  }

  const callBackRef = useCallback((node:T)=>{
    if(ref.current){
      ref.current.removeEventListener('focus',handleToggle)
      ref.current.removeEventListener('blur',handleToggle)
    }
    // To handle second test case to remove event listeners of previous ref
    ref.current = node
    if(node){
     node.addEventListener('focus',handleToggle)
     node.addEventListener('blur',handleToggle)
    }
  },[])

  return [callBackRef,isFocused];
}

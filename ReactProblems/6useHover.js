
import { Ref, useCallback, useRef, useState } from 'react'

export function useHover<T extends HTMLElement>(): [Ref<T>, boolean] {
  const ref = useRef<T>()
  const [isHovered,setIsHovered] = useState(false)  


  const onMouseEnter = () => {
    setIsHovered(true);
  };
  const onMouseLeave = () => {
    setIsHovered(false);
  };

   const callBackRef = useCallback((node:T)=>{

    if(ref.current){
      ref.current.removeEventListener('mouseenter',onMouseEnter)
      ref.current.removeEventListener('mouseleave',onMouseLeave)
    }
    // To handle second test case to remove event listeners of previous ref
    ref.current = node

      if(node){
        node.addEventListener('mouseenter', onMouseEnter);
        node.addEventListener('mouseleave', onMouseLeave);
      }
    },[])

  return [callBackRef, isHovered];
}

import { useEffect, useState } from "react";


export function useDebounce<T>(value: T, delay: number): T {

  const [debouncedValue,setDebouncedValue] = useState(value)
  useEffect(()=>{
    let timer = setTimeout(()=>{
      setDebouncedValue(value)
    },delay)
    return (()=>{
      clearTimeout(timer)
    })
  },[value])

  return debouncedValue
}
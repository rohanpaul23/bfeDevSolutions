
import React, { useState } from 'react'
export function PhoneNumberInput() {
  // your code here
  const [inputValue,setInputValue] = useState<string>("");

  const handleOnChange = (value:string) =>{
    let numeriCharacters = value.replace(/\D/g, "")

    if(numeriCharacters.length > 10) numeriCharacters = numeriCharacters.slice(0,10)
    if(numeriCharacters.length > 6) numeriCharacters = `${numeriCharacters.slice(0,6)}-${numeriCharacters.slice(6)}`
    if(numeriCharacters.length > 3) numeriCharacters = `(${numeriCharacters.slice(0,3)})${numeriCharacters.slice(3)}`
    setInputValue(numeriCharacters);
  }

  return <input data-testid="phone-number-input" type="text" value={inputValue} onChange={(e)=>handleOnChange(e.target.value)}/>
}

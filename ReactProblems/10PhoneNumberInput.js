import { useState } from "react";

export function PhoneNumberInput() {
  // Declare a state variable to store the formatted phone number
  const [inputValue, setInputValue] = useState<string>("");

  // Function to handle input changes
  const handleOnChange = (value: string) => {
    // Remove all non-digit characters using regex \D (matches anything that isn't a digit)
    let numericCharacters = value.replace(/\D/g, "");

    // Limit the number to a maximum of 10 digits (standard US phone number length)
    if (numericCharacters.length > 10) numericCharacters = numericCharacters.slice(0, 10);

    // If length > 6, insert a hyphen before the last 4 digits → e.g., "1234567890" → "123456-7890"
    if (numericCharacters.length > 6)
      numericCharacters = `${numericCharacters.slice(0, 6)}-${numericCharacters.slice(6)}`;

    // If length > 3, wrap the first 3 digits in parentheses → e.g., "123456-7890" → "(123)456-7890"
    if (numericCharacters.length > 3)
      numericCharacters = `(${numericCharacters.slice(0, 3)})${numericCharacters.slice(3)}`;

    // Update state with the newly formatted phone number
    setInputValue(numericCharacters);
  };

  // Render a controlled input element that displays the formatted phone number
  return (
    <input
      data-testid="phone-number-input" // for testing purposes
      type="text"
      value={inputValue} // bind to state so React controls the value
      onChange={(e) => handleOnChange(e.target.value)} // update formatting on each change
    />
  );
}

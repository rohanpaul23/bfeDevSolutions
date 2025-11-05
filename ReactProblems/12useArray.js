// This is a React problem from BFE.dev

import React, { useCallback, useState } from 'react'

// Define a TypeScript type that describes what actions are available
// when using the custom hook. It supports adding and removing elements.
type UseArrayActions<T> = {
  push: (item: T) => void,         // Function to add an item
  removeByIndex: (index: number) => void  // Function to remove item by index
}

// A custom React hook for managing array state
// It returns both the array value and helper functions (push, removeByIndex)
export function useArray<T>(initialValue: T[]): { value: T[] } & UseArrayActions<T> {
  // Initialize local state with the provided array
  const [value, setValue] = useState(initialValue);

  // `push` adds a new item to the array.
  // useCallback ensures the same function reference between renders
  const push = useCallback((item: T) => {
    // Set state by appending the new item to the previous array
    setValue((prevValue) => [...prevValue, item]);
  }, []);

  // `removeByIndex` removes an element from the array at a specific index
  const removeByIndex = useCallback((index: number) => {
    // Functional update form ensures we always work with the latest state
    setValue((prevValue) => {
      // Create a shallow copy so we don’t mutate the original array
      const newValue = [...prevValue];
      // Remove one element at the given index
      newValue.splice(index, 1);
      // Return the updated array as the new state
      return newValue;
    });
  }, []);

  // Return both the state and the utility functions
  return { value, push, removeByIndex };
}


// Example usage:
// (Uncomment this block when testing locally)
// This example creates a component that uses the `useArray` hook
// to manage an array of numbers and display them.
/*
export function App() {
  const { value, push, removeByIndex } = useArray([1, 2, 3]);

  return (
    <div>
      {value.join(', ')}
      <br />
      <button onClick={() => push(Math.floor(Math.random() * 10))}>Add Random</button>
      <button onClick={() => removeByIndex(0)}>Remove First</button>
    </div>
  );
}
*/
